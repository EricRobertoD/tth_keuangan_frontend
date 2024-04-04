import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";


export default function NavbarLoginPage() {
  
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/')
    }
  }, [])

  const navigate = useNavigate();

  const logoStyle = {
    width: "200px",
    height: "auto", 
    cursor: "pointer",
  };

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  const user = () => {
    navigate('/ManageUserPage')
  }

  const onIdle = () => {
    console.log('User is idle');
    localStorage.removeItem('authToken')
    navigate('/')
  };

  useIdleTimer({
    onIdle,
    timeout: 180 * 60 * 1000, 
  });

  return (
    <Navbar isBordered className="bg-white py-5">
      <NavbarBrand >
        <Link to = "/DashboardPage">
        <img src={assets.logoTTH} alt="Logo" style={logoStyle} />
            </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-2" justify="center">
      <NavbarItem isActive>
          <Link to = "/FinanceDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Finance
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/ReleasePage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Release
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/RealisasiPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Realisasi
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TransaksiDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Transaksi
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Total
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalTWDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            TWData
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalTahunDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            TahunData
          </Link>
        </NavbarItem>
        </NavbarContent>
      <NavbarContent justify="end" className="pl-10">
        <Button color="danger" size="lg" onClick={user}>
            User
        </Button>
        <Button color="danger" size="lg" onClick={logout}>
            Logout
        </Button>
      </NavbarContent>
    </Navbar>
  );
}