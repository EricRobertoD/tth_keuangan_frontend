import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function NavbarPage() {
  const logoStyle = {
    width: "200px",
    height: "auto", 
    cursor: "pointer",
  };
  const navigate = useNavigate();
  
  const login = ()=>{
    navigate('/LoginPage')
  }

  return (
    <Navbar isBordered className="bg-white py-5">
      <NavbarBrand >
        <Link to = "/">
        <img src={assets.logoTTH} alt="Logo" style={logoStyle} />
           </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Button color="danger" size="lg" onClick={login}>
            Login
        </Button>
      </NavbarContent>
    </Navbar>
  );
}