import { useEffect, useState } from "react";
import { Input, Card, Button, CardHeader, Divider, SelectItem, Select } from "@nextui-org/react";
import FooterPage from "../../components/FooterPage";
import NavbarLoginPage from "../../components/NavbarLoginPage";
import Swal from "sweetalert2";
import assets from "../../assets";
import BASE_URL from "../../../apiConfig";

export default function RealisasiPage() {
    const [kategoriData, setKategoriData] = useState([]);
    const [divisiData, setDivisiData] = useState([]);
    const [jumlahRealisasi, setJumlahRealisasi] = useState();
    const [selectedKategoriId, setSelectedKategoriId] = useState(new Set([]));
    const [selectedDivisiId, setSelectedDivisiId] = useState(new Set([]));
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isDivisiDisabled, setIsDivisiDisabled] = useState(false);
    const [uraian, setUraian] = useState('');

    const fetchDataKategori = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showKategori`, {
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
            setKategoriData(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };


    const fetchDataDivisi = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showDivisi`, {
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
            setDivisiData(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const storeRealisasi = () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Apakah anda ingin menambahkan realisasi?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, tambahkan realisasi!",
        }).then((result) => {
            if (result.isConfirmed) {
                const dataRealisasi = {
                    id_kategori: [...selectedKategoriId][0],
                    id_divisi: [...selectedDivisiId][0],
                    input_value: jumlahRealisasi,
                    bulan: selectedMonth,
                    tahun: selectedYear,
                    uraian: uraian,
                };

                const authToken = localStorage.getItem("authToken");

                fetch(`${BASE_URL}/api/realisasi`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(dataRealisasi),
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((responseData) => {
                        if (responseData.status === 'success') {
                            fetchDataKategori();
                            fetchDataDivisi();
                            setJumlahRealisasi(null);
                            setSelectedKategoriId(new Set([...selectedKategoriId]));
                            setSelectedDivisiId(new Set(null));
                            setSelectedMonth(selectedMonth);
                            setUraian('');
                            setSelectedYear(new Date().getFullYear());
                            Swal.fire({
                                icon: "success",
                                title: "Berhasil Melakukan Realisasi",
                                text: "Anda berhasil melakukan realisasi",
                            });
                        } else {
                            if (responseData.errors) {
                                const errorMessages = Object.values(responseData.errors).join('\n');
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Realisasi tidak berhasil!',
                                    text: errorMessages,
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Realisasi tidak berhasil!',
                                    text: 'Mohon di cek lagi.',
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        Swal.close();
                        console.error('Error:', error);
                    });
            }
        });
    };

    useEffect(() => {
        fetchDataKategori();
        fetchDataDivisi();
    }, []);


    useEffect(() => {
        const kategoriArray = Array.from(selectedKategoriId);

        if (
            kategoriArray.length > 0 &&
            ['51346003', '51367118', '51505011', '51506004', '51508006', '51512005'].includes(kategoriArray[0])
        ) {
            setSelectedDivisiId(new Set(["IRA".toString()]));
            setIsDivisiDisabled(true);
        } else {
            setSelectedDivisiId(new Set(null));
            setIsDivisiDisabled(false);
        }
    }, [selectedKategoriId]);


    return (
        <>
            <NavbarLoginPage />
            <Card className="px-20 py-20">
                <div className="container mx-auto py-10 shadow-xl max-w-screen-lg">

                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1">
                            <CardHeader className="flex gap-3">
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold">Realisasi</p>
                                    <p className="text-small text-default-500">Pengurangan jumlah saldo</p>
                                </div>
                            </CardHeader>
                            <Divider />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center ml-20">
                        <div className="flex-1">
                            <div className="col-span-1 m-5">
                                <Select
                                    label="Kategori"
                                    className="max-w-xs"
                                    value={selectedKategoriId}
                                    selectedKeys={selectedKategoriId}
                                    onSelectionChange={(e) => setSelectedKategoriId(e)}
                                >
                                    {kategoriData.map((options) => (
                                        <SelectItem key={options.id_kategori} value={options.id_kategori}>
                                            {options.nama_kategori}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-span-1 m-5">
                                <Select
                                    label="Lab"
                                    className="max-w-xs"
                                    value={selectedDivisiId}
                                    selectedKeys={selectedDivisiId}
                                    onSelectionChange={(e) => setSelectedDivisiId(e)}
                                    isDisabled={isDivisiDisabled}
                                >
                                    {divisiData.map((options) => (
                                        <SelectItem key={options.id_divisi} value={options.id_divisi}>
                                            {options.nama_divisi}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex gap-5">
                                <div className="flex-1 m-5">
                                    <Select
                                        label="Bulan"
                                        className="w-full max-w-xs"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {[...Array(12)].map((_, index) => (
                                            <SelectItem key={index + 1} value={index + 1}>
                                                {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="m-5">
                                    <Input
                                        type="number"
                                        className="max-w-xs"
                                        label="Tahun"
                                        variant="bordered"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 m-5">
                                <Input
                                    type="text"
                                    className="max-w-xs"
                                    label="Jumlah Realisasi"
                                    variant="bordered"
                                    value={jumlahRealisasi ? Number(jumlahRealisasi).toLocaleString('id-ID') : ''}
                                    onChange={(e) => setJumlahRealisasi(e.target.value.replace(/[^\d]/g, ''))}
                                />
                            </div>
                            <div className="col-span-1 m-5">
                                <Input
                                    type="text"
                                    className="max-w-xs"
                                    label="Uraian"
                                    variant="bordered"
                                    value={uraian}
                                    onChange={(e) => setUraian(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button className="col-span-1 m-5 bg-red-500 text-white" onPress={storeRealisasi}>
                                    Save
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 gap-6">
                            <img src={assets.mail_sent} alt="Your Image" className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </Card>
            <FooterPage />
        </>
    );
}


