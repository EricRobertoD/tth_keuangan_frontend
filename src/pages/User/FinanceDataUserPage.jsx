import React, { useEffect, useState, useRef } from "react";
import { Input, Card, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Pagination } from "@nextui-org/react";
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

export default function FinanceDataUserPage() {
    const [groupedData, setGroupedData] = useState([]);
    const [total, setTotal] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState(new Set([]));
    const [selectedMonth, setSelectedMonth] = useState(new Set([]));
    const [monthOption, setMonthOption] = useState([]);
    const [yearOption, setYearOption] = useState([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const tableRef = useRef(null);


    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showTransaksiAgregat`, {
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
            const groupedResult = groupData(result.data);
            setGroupedData(groupedResult);
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
            }
            );
            const monthOption = Array.from(months).sort().map((month) => month.toString());
            setMonthOption(Array.from(months).sort());
            setSelectedMonth(monthOption);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };


    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const groupData = (data) => {
        const grouped = {};
        data.forEach((row) => {
            const key = `${row.id_kategori}_${row.bulan}_${row.tahun}`;
            if (!grouped[key]) {
                grouped[key] = {
                    id: row.id_kategori,
                    bulan: row.bulan,
                    tahun: row.tahun,
                    rows: [],
                };
            }
            grouped[key].rows.push(row);
        });
    
        const sortedGrouped = Object.values(grouped).sort((a, b) => {
            if (a.tahun === b.tahun) {
                if (a.bulan === b.bulan) {
                    const id_kategori_order = ['51332004', '51351001', '51508001', '51346003', '51367118', '51505011', '51506004', '51508006', '51512005'];
                    return id_kategori_order.indexOf(a.id) - id_kategori_order.indexOf(b.id);
                } else {
                    return b.bulan - a.bulan;
                }
            } else {
                return b.tahun - a.tahun;
            }
        });
    
        return sortedGrouped;
    };
    

    const filteredData = groupedData.filter((group) => {
        const lowerCaseSearch = search.trim().toLowerCase();
        return (
            (group.id.toString().includes(lowerCaseSearch) ||
                monthNames[group.bulan - 1].toLowerCase().includes(lowerCaseSearch) ||
                group.tahun.toString().includes(lowerCaseSearch) ||
                group.rows.some((row) =>
                    row.kategori.nama_kategori.toLowerCase().includes(lowerCaseSearch) ||
                    (row.divisi && row.divisi.nama_divisi.toLowerCase().includes(lowerCaseSearch)) ||
                    monthNames[row.bulan - 1].toLowerCase().includes(lowerCaseSearch) ||
                    row.tahun.toString().includes(lowerCaseSearch) ||
                    formatIDR(row.release_tth).toLowerCase().includes(lowerCaseSearch) ||
                    formatIDR(row.realisasi).toLowerCase().includes(lowerCaseSearch) ||
                    formatIDR(row.saldo_akhir).toLowerCase().includes(lowerCaseSearch)
                )) &&
            (selectedYear.length === 0 || [...selectedYear].includes(group.tahun.toString())) &&
            (selectedMonth.length === 0 || [...selectedMonth].includes(group.bulan.toString()))
        );
    });

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
                    <table ref={tableRef} className="w-full border-collapse border border-gray-300 my-10 shadow-lg">
                        <thead>
                            <tr>
                                <th className="border border-gray-300">Nama Kategori</th>
                                <th className="border border-gray-300">Lab</th>
                                <th className="border border-gray-300">Bulan</th>
                                <th className="border border-gray-300">Tahun</th>
                                <th className="border border-gray-300">Release</th>
                                <th className="border border-gray-300">Realisasi</th>
                                <th className="border border-gray-300">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData
                                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                .filter((group) => {
                                    const lowerCaseSearch = search.trim().toLowerCase();
                                    return (
                                        (group.id.toString().includes(lowerCaseSearch) ||
                                            monthNames[group.bulan - 1].toLowerCase().includes(lowerCaseSearch) ||
                                            group.tahun.toString().includes(lowerCaseSearch) ||
                                            group.rows.some((row) =>
                                                row.kategori.nama_kategori.toLowerCase().includes(lowerCaseSearch) ||
                                                (row.divisi && row.divisi.nama_divisi.toLowerCase().includes(lowerCaseSearch)) ||
                                                monthNames[row.bulan - 1].toLowerCase().includes(lowerCaseSearch) ||
                                                row.tahun.toString().includes(lowerCaseSearch) ||
                                                formatIDR(row.release_tth).toLowerCase().includes(lowerCaseSearch) ||
                                                formatIDR(row.realisasi).toLowerCase().includes(lowerCaseSearch) ||
                                                formatIDR(row.saldo_akhir).toLowerCase().includes(lowerCaseSearch)
                                            )) &&
                                        (selectedYear.length === 0 || [...selectedYear].includes(group.tahun.toString())) &&
                                        (selectedMonth.length === 0 || [...selectedMonth].includes(group.bulan.toString()))
                                    );
                                })
                                .map((group) => {
                                    const sortedRows = group.rows.sort((a, b) => {
                                        const order = ['IRA', 'UREL', 'IQA', 'DEQA', 'SIR', 'BAN', 'ISR', 'FMC'];
                                        return order.indexOf(a.id_divisi) - order.indexOf(b.id_divisi);
                                    });

                                    return (
                                        <React.Fragment key={group.id + group.bulan + group.tahun}>
                                            <tr>
                                                <td style={{ height: "50px" }}>{`ID Kategori: ${group.id}`}</td>
                                            </tr>

                                            {sortedRows.map((row) => (
                                                <tr key={row.id_transaksi_agregat}>
                                                    <td className="border border-gray-300">{row.kategori.nama_kategori}</td>
                                                    <td className="border border-gray-300 text-center">{row.divisi ? row.divisi.nama_divisi || "-" : "-"}</td>
                                                    <td className="border border-gray-300 text-center">{monthNames[row.bulan - 1]}</td>
                                                    <td className="border border-gray-300 text-center">{row.tahun}</td>
                                                    <td className="border border-gray-300 text-right">{formatIDR(row.release_tth)}</td>
                                                    <td className="border border-gray-300 text-right">{formatIDR(row.realisasi)}</td>
                                                    <td className="border border-gray-300 text-right">{formatIDR(row.saldo_akhir)}</td>
                                                </tr>
                                            ))}

                                            <tr>
                                                {total
                                                    ?.find(
                                                        (t) =>
                                                            t.bulan === group.bulan &&
                                                            t.tahun === group.tahun &&
                                                            t.id_kategori === group.id
                                                    ) && (
                                                        <React.Fragment>
                                                            <td className="border border-gray-300" colSpan={4}>
                                                                Total
                                                            </td>
                                                            <td className="border border-gray-300 text-right">
                                                                {formatIDR(
                                                                    total.find(
                                                                        (t) =>
                                                                            t.bulan === group.bulan &&
                                                                            t.tahun === group.tahun &&
                                                                            t.id_kategori === group.id
                                                                    ).total_release
                                                                )}
                                                            </td>
                                                            <td className="border border-gray-300 text-right">
                                                                {formatIDR(
                                                                    total.find(
                                                                        (t) =>
                                                                            t.bulan === group.bulan &&
                                                                            t.tahun === group.tahun &&
                                                                            t.id_kategori === group.id
                                                                    ).total_realisasi
                                                                )}
                                                            </td>
                                                            <td className="border border-gray-300 text-right">
                                                                {formatIDR(
                                                                    total.find(
                                                                        (t) =>
                                                                            t.bulan === group.bulan &&
                                                                            t.tahun === group.tahun &&
                                                                            t.id_kategori === group.id
                                                                    ).total_saldo_akhir
                                                                )}
                                                            </td>
                                                        </React.Fragment>
                                                    )}
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                        </tbody>

                    </table>

                    <div className="flex w-full justify-center my-4">
                        <Pagination
                            page={page}
                            total={Math.ceil(groupedData.length / rowsPerPage)}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </Card>
            <FooterPage />
        </>
    );
}
