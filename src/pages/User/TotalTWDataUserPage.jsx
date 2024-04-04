import React, { useEffect, useState, useRef } from "react";
import { Input, Card, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Pagination, Table, TableHeader, TableRow, TableBody, TableCell, TableColumn } from "@nextui-org/react";
import FooterPage from "../../components/FooterPage";
import BASE_URL from "../../../apiConfig";
import NavbarUserPage from "../../components/NavbarUserPage";


const formatIDR = (value) => {
    const formattedValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    return formattedValue.replace(/\./g, ',');
};

export default function TotalTWDataUserPage() {
    const [groupedData, setGroupedData] = useState([]);
    const [total, setTotal] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Set([]));
    const [yearOption, setYearOption] = useState([]);
    const [page, setPage] = useState(1);
    const tableRef = useRef(null);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showTotalSum`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            result.data.forEach((item) => {
                item.total_release = parseInt(item.total_release, 10);
                item.total_realisasi = parseInt(item.total_realisasi, 10);
                item.total_saldo = parseInt(item.total_saldo, 10);
            });
            setGroupedData(result.data);
            setTotal(result.totals);

            const years = new Set();
            result.data.forEach((row) => {
                years.add(row.tahun);
            });
            const yearOption = Array.from(years).sort((a, b) => b - a).map((year) => year.toString());
            setYearOption(yearOption);
            setSelectedYear(yearOption);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = groupedData.filter((group) => {
        const lowerCaseSearch = search.trim().toLowerCase();
        return (
            (group.id_divisi.toString().includes(lowerCaseSearch) ||
                group.tahun.toString().includes(lowerCaseSearch) ||
                group.total_release.toString().includes(lowerCaseSearch) ||
                group.total_realisasi.toString().includes(lowerCaseSearch) ||
                group.total_saldo.toString().includes(lowerCaseSearch)) &&
            (selectedYear.length === 0 || [...selectedYear].includes(group.tahun.toString()))
        );
    });

    const groupedByQuarterAndYear = {};
    filteredData.forEach((item) => {
        const quarter = Math.ceil(item.bulan / 3);
        const key = `TW ${quarter}, ${item.tahun}`;
        if (!groupedByQuarterAndYear[key]) {
            groupedByQuarterAndYear[key] = [];
        }
        groupedByQuarterAndYear[key].push(item);
    });
    
    const sortedQuarters = Object.keys(groupedByQuarterAndYear).sort((a, b) => {
        const yearA = parseInt(a.split(', ')[1]);
        const yearB = parseInt(b.split(', ')[1]);
        return yearB - yearA;
    });

    const totalPages = sortedQuarters.length;

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [page]);

    return (
        <>
            <NavbarUserPage />
            <Card className="px-10 py-10">
                <div className="container mx-auto py-10">
                    <Input
                        className="w-60"
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex gap-3 mt-4">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex bg-red-500 text-white">
                                <Button variant="flat">
                                    Year
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={selectedYear}
                                selectionMode="multiple"
                                onSelectionChange={setSelectedYear}
                            >
                                {yearOption.map((year) => (
                                    <DropdownItem key={year} className="capitalize">
                                        {year}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {sortedQuarters.map((quarterYear, index) => (
                        <div key={quarterYear} style={{ display: index + 1 === page ? 'block' : 'none' }}>
                            <h2 ref={tableRef} className="mt-6 mb-2 font-semibold">{quarterYear}</h2>
                            <Table className="w-full border-collapse border border-gray-300 my-4 shadow-lg">
                                <TableHeader>
                                    <TableColumn className="border border-gray-300 text-center">Divisi</TableColumn>
                                    <TableColumn className="border border-gray-300 text-center">Total Release</TableColumn>
                                    <TableColumn className="border border-gray-300 text-center">Total Realisasi</TableColumn>
                                    <TableColumn className="border border-gray-300 text-center">Saldo</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {groupedByQuarterAndYear[quarterYear].map((group) => (
                                        <TableRow key={`${group.id_divisi}_${group.bulan}_${group.tahun}`}>
                                            <TableCell className="border border-gray-300 text-center">{group.id_divisi}</TableCell>
                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_release)}</TableCell>
                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_realisasi)}</TableCell>
                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_saldo)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell className="border border-gray-300 font-semibold text-center">Total</TableCell>
                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(groupedByQuarterAndYear[quarterYear].reduce((acc, curr) => acc + curr.total_release, 0))}</TableCell>
                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(groupedByQuarterAndYear[quarterYear].reduce((acc, curr) => acc + curr.total_realisasi, 0))}</TableCell>
                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(groupedByQuarterAndYear[quarterYear].reduce((acc, curr) => acc + curr.total_saldo, 0))}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border border-gray-300 font-semibold text-center">Penyerapan</TableCell>
                                        <TableCell className="border border-gray-300 font-semibold text-right">
                                            {((groupedByQuarterAndYear[quarterYear].reduce((acc, curr) => acc + curr.total_realisasi, 0) / groupedByQuarterAndYear[quarterYear].reduce((acc, curr) => acc + curr.total_release, 0)) * 100).toFixed(2)}%
                                        </TableCell>
                                        <TableCell className="border border-gray-300 text-center">-</TableCell>
                                        <TableCell className="border border-gray-300 text-center">-</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                    <div className="flex w-full justify-center my-4">
                        <Pagination
                            page={page}
                            total={totalPages}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </Card>
            <FooterPage />
        </>
    );
}
