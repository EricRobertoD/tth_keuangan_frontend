import React, { useEffect, useState, useRef } from "react";
import { Input, Card, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Pagination, Table, TableHeader, TableRow, TableBody, TableCell, TableColumn } from "@nextui-org/react";
import FooterPage from "../../components/FooterPage";
import BASE_URL from "../../../apiConfig";
import NavbarUserPage from "../../components/NavbarUserPage";

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const formatIDR = (value) => {
    const formattedValue = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);

    return formattedValue.replace(/\./g, ',');
};

export default function TotalDataUserPage() {
    const [groupedData, setGroupedData] = useState([]);
    const [total, setTotal] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Set([]));
    const [selectedMonth, setSelectedMonth] = useState(new Set([]));
    const [monthOption, setMonthOption] = useState([]);
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

            const months = new Set();
            result.data.forEach((row) => {
                months.add(row.bulan);
            });
            const monthOption = Array.from(months).sort().map((month) => month.toString());
            setMonthOption(Array.from(months).sort());
            setSelectedMonth(monthOption);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const filteredData = groupedData.filter((group) => {
        const lowerCaseSearch = search.trim().toLowerCase();
        return (
            (group.id_divisi.toString().includes(lowerCaseSearch) ||
                monthNames[group.bulan - 1].toLowerCase().includes(lowerCaseSearch) ||
                group.tahun.toString().includes(lowerCaseSearch) ||
                group.total_release.toString().includes(lowerCaseSearch) ||
                group.total_realisasi.toString().includes(lowerCaseSearch) ||
                group.total_saldo.toString().includes(lowerCaseSearch)) &&
            (selectedYear.length === 0 || [...selectedYear].includes(group.tahun.toString())) &&
            (selectedMonth.length === 0 || [...selectedMonth].includes(group.bulan.toString()))
        );
    });

    const groupedByMonthAndYear = {};
    filteredData.forEach((item) => {
        const key = `${monthNames[item.bulan - 1]} ${item.tahun}`;
        if (!groupedByMonthAndYear[key]) {
            groupedByMonthAndYear[key] = [];
        }
        groupedByMonthAndYear[key].push(item);
    });

    const groupedByYear = {};
    filteredData.forEach((item) => {
        const key = item.tahun;
        if (!groupedByYear[key]) {
            groupedByYear[key] = [];
        }
        groupedByYear[key].push(item);
    });

    const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

    const totalPages = sortedYears.length;


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        <Dropdown >
                            <DropdownTrigger className="hidden sm:flex bg-red-500 text-white">
                                <Button variant="flat">
                                    Month
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={selectedMonth}
                                selectionMode="multiple"
                                onSelectionChange={setSelectedMonth}
                            >
                                {monthOption.map((month) => (
                                    <DropdownItem key={month} className="capitalize">
                                        {monthNames[month - 1]}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

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
                    {sortedYears.map((year, index) => (
                        <div key={year} style={{ display: index + 1 === page ? 'block' : 'none' }}>
                            <h2 ref={tableRef} className="mt-6 mb-2 font-semibold">{year}</h2>
                            {monthNames.map((month) => {
                                const key = `${month} ${year}`;
                                if (groupedByMonthAndYear[key]) {
                                    const sortedData = groupedByMonthAndYear[key].sort((a, b) => {
                                        const order = ['IRA', 'UREL', 'IQA', 'DEQA', 'SIR', 'BAN', 'ISR', 'FMC'];
                                        return order.indexOf(a.id_divisi) - order.indexOf(b.id_divisi);
                                    });
                                    return (
                                        <div key={key}>
                                            <h3 className="mt-6 mb-2 font-semibold">{`Bulan : ${month}`}</h3>
                                            <Table className="w-full border-collapse border border-gray-300 my-4 shadow-lg">
                                                <TableHeader>
                                                    <TableColumn className="border border-gray-300 text-center">Divisi</TableColumn>
                                                    <TableColumn className="border border-gray-300 text-center">Total Release</TableColumn>
                                                    <TableColumn className="border border-gray-300 text-center">Total Realisasi</TableColumn>
                                                    <TableColumn className="border border-gray-300 text-center">Saldo</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {sortedData.map((group) => (
                                                        <TableRow key={`${group.id_divisi}_${group.bulan}_${group.tahun}`}>
                                                            <TableCell className="border border-gray-300 text-center">{group.id_divisi}</TableCell>
                                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_release)}</TableCell>
                                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_realisasi)}</TableCell>
                                                            <TableCell className="border border-gray-300 text-right">{formatIDR(group.total_saldo)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell className="border border-gray-300 font-semibold text-center">Total</TableCell>
                                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(sortedData.reduce((acc, curr) => acc + curr.total_release, 0))}</TableCell>
                                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(sortedData.reduce((acc, curr) => acc + curr.total_realisasi, 0))}</TableCell>
                                                        <TableCell className="border border-gray-300 font-semibold text-right">{formatIDR(sortedData.reduce((acc, curr) => acc + curr.total_saldo, 0))}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="border border-gray-300 font-semibold text-center">Penyerapan</TableCell>
                                                        <TableCell className="border border-gray-300 font-semibold text-right">
                                                            {((sortedData.reduce((acc, curr) => acc + curr.total_realisasi, 0) / sortedData.reduce((acc, curr) => acc + curr.total_release, 0)) * 100).toFixed(2)}%
                                                        </TableCell>
                                                        <TableCell className="border border-gray-300 text-center">-</TableCell>
                                                        <TableCell className="border border-gray-300 text-center">-</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
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