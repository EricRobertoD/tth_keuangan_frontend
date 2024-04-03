import { useEffect, useState } from "react";
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import FooterPage from "../../components/FooterPage";
import NavbarLoginPage from "../../components/NavbarLoginPage";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";

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

export default function TransaksiDataPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Set([]));
    const [selectedYear, setSelectedYear] = useState(new Set([]));
    const [monthOption, setMonthOption] = useState([]);
    const [yearOption, setYearOption] = useState([]);
    const [transaksiDelete, setTransaksiDelete] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);


    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showTransaksiHistory`, {
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
            if (result.status === "success") {
                setData(result.data);
    
                const uniqueMonths = Array.from(new Set(result.data.map(row => new Date(row.date).getMonth() + 1)));
                const monthStrings = uniqueMonths.map(month => month.toString());
                setMonthOption(monthStrings);
                setSelectedMonth(new Set(monthStrings));
    
                const uniqueYears = Array.from(new Set(result.data.map(row => new Date(row.date).getFullYear())));
                const yearStrings = uniqueYears.map(year => year.toString());
                setYearOption(yearStrings);
                setSelectedYear(new Set(yearStrings));
            } else {
                throw new Error("Fetch data status is not success");
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    

    const deleteOpenChange = (value) => {
        setDeleteOpen(value);
    };

    const handleConfirmDelete = () => {
        deleteOpenChange(false);
        if (transaksiDelete) {
            handleDeleteTransaksi(transaksiDelete.id_transaksi);
            setTransaksiDelete(null);
        }
    };

    const handleCancelDelete = () => {
        deleteOpenChange(false);
        setTransaksiDelete(null);
    };


    const handleDeleteTransaksi = (id_transaksi) => {
        Swal.showLoading();
        const authToken = localStorage.getItem("authToken");

        fetch(`${BASE_URL}/api/transaksi/${id_transaksi}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "Delete Transaksi Successful",
                        text: "Transaksi has been deleted.",
                    });
                    fetchData();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Delete Transaksi Failed",
                        text: "Failed to delete Transaksi. Please try again.",
                    });
                }
            })
            .catch((error) => {
                Swal.close();
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
    }, [selectedMonth, monthOption]);


    return (
        <>
            <NavbarLoginPage />
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
                                    Month
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={selectedMonth}
                                selectionMode="multiple"
                                onSelectionChange={(selected) => setSelectedMonth(selected)}
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
                                onSelectionChange={(selected) => setSelectedYear(selected)}
                            >
                                {yearOption.map((year) => (
                                    <DropdownItem key={year} className="capitalize">
                                        {year}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                    </div>

                    <Table className="py-10">
                        <TableHeader>
                            <TableColumn>Nama Kategori</TableColumn>
                            <TableColumn>Uraian</TableColumn>
                            <TableColumn>Lab</TableColumn>
                            <TableColumn>Bulan</TableColumn>
                            <TableColumn>Tahun</TableColumn>
                            <TableColumn>Jenis</TableColumn>
                            <TableColumn>Nominal</TableColumn>
                            <TableColumn>Delete</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data
                                .filter((row) => {
                                    const lowerCaseSearch = search.trim().toLowerCase();
                                    return (
                                        row.kategori.nama_kategori.toLowerCase().includes(lowerCaseSearch) ||
                                        (row.divisi && row.divisi.nama_divisi.toLowerCase().includes(lowerCaseSearch))
                                    );
                                })
                                .filter((row) => (
                                    (!selectedMonth.size || selectedMonth.has((new Date(row.date).getMonth() + 1).toString())) &&
                                    (!selectedYear.size || selectedYear.has(new Date(row.date).getFullYear().toString()))
                                ))

                                .map((row) => (
                                    <TableRow key={row.id_transaksi}>
                                        <TableCell>{row.kategori.nama_kategori}</TableCell>
                                        <TableCell>{row.uraian || "-"}</TableCell>
                                        <TableCell>{row.divisi ? row.divisi.nama_divisi || "-" : "-"}</TableCell>
                                        <TableCell>{new Date(row.date).toLocaleString('default', { month: 'long' })}</TableCell>
                                        <TableCell>{new Date(row.date).getFullYear()}</TableCell>
                                        <TableCell>{row.jenis}</TableCell>
                                        <TableCell>{formatIDR(row.harga)}</TableCell>
                                        <TableCell>

                                            <Button
                                                color="danger"
                                                variant="flat"
                                                onClick={() => {
                                                    setTransaksiDelete(row);
                                                    deleteOpenChange(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </Card>
            <FooterPage />


            <Modal size="md" isOpen={deleteOpen} onOpenChange={deleteOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
                    <ModalBody>Are you sure you want to delete this ?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={handleCancelDelete}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleConfirmDelete}>
                            Confirm Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
