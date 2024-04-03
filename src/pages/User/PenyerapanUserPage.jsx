import React, { useEffect, useState, useRef } from "react";
import {
    Dropdown,
    DropdownTrigger,
    Button,
    DropdownMenu,
    DropdownItem,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Card,
} from "@nextui-org/react";
import FooterPage from "../../components/FooterPage";
import BASE_URL from "../../../apiConfig";
import NavbarUserPage from "../../components/NavbarUserPage";

export default function PenyerapanUserPage() {
    const [penyerapanData, setPenyerapanData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Set([]));
    const [yearOption, setYearOption] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const fetchDataPenyerapan = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showTotalPenyerapan`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setPenyerapanData(result.data);

            const years = new Set();
            result.data.forEach((row) => {
                years.add(row.tahun);
            });
            setYearOption(Array.from(years).sort().map((year) => year.toString()));

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchDataPenyerapan();
      }, []);

    useEffect(() => {
        setSelectedKeys(yearOption);
    }, [yearOption]);

    useEffect(() => {
        setSelectedYear(new Set(selectedKeys));
    }, [selectedKeys]);

    const handleYearSelectionChange = (selectedKeys) => {
        setSelectedKeys(selectedKeys);
    };

    return (
        <>
            <NavbarUserPage />
            <Card className="px-10 py-10">
                <div className="container mx-auto py-10">
                    <div className="flex gap-3 mt-4">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex bg-red-500 text-white">
                                <Button variant="flat">
                                    Year
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Year Selection"
                                closeOnSelect={false}
                                selectedKeys={selectedKeys}
                                selectionMode="multiple"
                                onSelectionChange={handleYearSelectionChange}
                            >
                                {yearOption.map((year) => (
                                    <DropdownItem key={year} className="capitalize">
                                        {year}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div>
                        <h3 className="mt-6 mb-2 font-semibold">Penyerapan Data</h3>
                        <Table className="w-full border-collapse border border-gray-300 my-4 shadow-lg">
                            <TableHeader>
                                <TableColumn className="border border-gray-300 text-center">Bulan</TableColumn>
                                <TableColumn className="border border-gray-300 text-center">Tahun</TableColumn>
                                <TableColumn className="border border-gray-300 text-center">Total Penyerapan</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {penyerapanData
                                    .filter((data) =>
                                        selectedYear.has(data.tahun.toString())
                                    )
                                    .map((data, index) => (
                                        <TableRow
                                            key={index}
                                            className="text-center"
                                        >
                                            <TableCell className="border border-gray-300">
                                                {data.bulan}
                                            </TableCell>
                                            <TableCell className="border border-gray-300">
                                                {data.tahun}
                                            </TableCell>
                                            <TableCell className="border border-gray-300">
                                                {data.total_penyerapan}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex w-full justify-center my-4">
                        {/* ... */}
                    </div>
                </div>
            </Card>
            <FooterPage />
        </>
    );
}