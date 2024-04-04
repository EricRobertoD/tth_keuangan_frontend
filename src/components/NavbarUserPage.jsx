import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";


export default function NavbarUserPage() {
  const logoStyle = {
    width: "200px",
    height: "auto", 
    cursor: "pointer",
  };
  const navigate = useNavigate();
  
  const logout = ()=>{
    localStorage.removeItem('authToken')
    navigate('/')
  }

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/')
    }
  }, [])
  return (
    <Navbar isBordered className="bg-white py-5">
      <NavbarBrand >
        <Link to = "/DashboardUserPage">
        <img src={assets.logoTTH} alt="Logo" style={logoStyle} />
           </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      <NavbarItem isActive>
          <Link to = "/FinanceDataUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Finance Data
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TransaksiDataUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Transaksi
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalDataUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Total
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/PenyerapanUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Penyerapan
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalTWDataUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            TWData
          </Link>
        </NavbarItem>
      <NavbarItem isActive>
          <Link to = "/TotalTahunDataUserPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            TahunData
          </Link>
        </NavbarItem>
        </NavbarContent>
      <NavbarContent justify="end">
        <Button color="danger" size="lg" onClick={logout}>
            Logout
        </Button>
      </NavbarContent>
    </Navbar>
  );
}