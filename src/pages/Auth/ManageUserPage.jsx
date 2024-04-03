import { useEffect, useState } from "react";
import { Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import FooterPage from "../../components/FooterPage";
import NavbarLoginPage from "../../components/NavbarLoginPage";

export default function ManageUserPage() {
    const [users, setUsers] = useState([]);
    const [deleteUser, setDeleteUser] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [registerOpen, setRegisterOpen] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/showUser`, {
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
            if (result.data) {
                setUsers(result.data);
            } else {
                throw new Error("Fetch data status is not success");
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    const deleteUserHandler = () => {
        if (deleteUser) {
            Swal.showLoading();
            const authToken = localStorage.getItem("authToken");

            fetch(`${BASE_URL}/api/user/${deleteUser.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    Swal.close();

                    if (data.message === "User deleted successfully") {
                        Swal.fire({
                            icon: "success",
                            title: "Delete User Successful",
                            text: "User has been deleted.",
                        });
                        fetchUsers();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Delete User Failed",
                            text: "Failed to delete User. Please try again.",
                        });
                    }
                })
                .catch((error) => {
                    Swal.close();
                    console.error("Error:", error);
                });
        }
        setDeleteOpen(false);
    };

    const closeDeleteModal = () => {
        setDeleteOpen(false);
    };

    const handleRegister = () => {
        Swal.showLoading();
        
        const registerData = {
            name: name,
            password: password,
        };

        fetch(`${BASE_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        text: 'You have successfully registered.',
                    });
                    console.log('Registration successful');
                    setPassword('');
                    setName('');
                    fetchUsers();
                } else {
                    console.log('Registration failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Registration Failed',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Registration Failed',
                            text: 'Please check the registration details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    const closeRegisterModal = () => {
        setRegisterOpen(false);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <NavbarLoginPage />
            <Card className="px-10 py-10">
                <div className="container mx-auto py-10">
                    <div className="flex items-center mb-4">
                        <Input
                            className="w-60 mr-4"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            color="secondary"
                            onClick={() => setRegisterOpen(true)}
                        >
                            Register
                        </Button>
                    </div>

                    <Table className="py-10">
                        <TableHeader>
                            <TableColumn>Nomor</TableColumn>
                            <TableColumn>Nama</TableColumn>
                            <TableColumn>Delete</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>

                                        <Button
                                            color="danger"
                                            variant="flat"
                                            onClick={() => {
                                                setDeleteUser(row);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <Modal size="md" isOpen={deleteOpen} onOpenChange={closeDeleteModal}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Confirmation</ModalHeader>
                    <ModalBody>Are you sure you want to delete this user?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" auto onClick={deleteUserHandler}>
                            Confirm Delete
                        </Button>
                        <Button color="primary" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal size="md" isOpen={registerOpen} onOpenChange={closeRegisterModal}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Register</ModalHeader>
                    <ModalBody>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-600">Name</label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600">Password</label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleRegister}>
                            Register
                        </Button>
                        <Button color="error" onClick={closeRegisterModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <FooterPage />
        </>
    );
}
