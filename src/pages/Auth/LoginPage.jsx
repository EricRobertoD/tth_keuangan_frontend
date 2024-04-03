import { useState } from "react";
import NavbarPage from "../../components/NavbarPage";
import Swal from 'sweetalert2';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../../apiConfig";

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // Default to user login
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate(loginType === 'admin' ? '/DashboardPage' : '/DashboardUserPage');
    }
  }, [loginType]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }
    
  const handleLogin = () => {
    const loginData = {
      name: name,
      password: password,
    };

    const loginEndpoint = loginType === 'admin' ? 'loginAdmin' : 'login';

    fetch(`${BASE_URL}/api/${loginEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Authenticated') {
          console.log('Login berhasil');
          localStorage.setItem('authToken', data.data.access_token);
          navigate(loginType === 'admin' ? '/DashboardPage' : '/DashboardUserPage');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Invalid name or password',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'An error occurred. Please try again.',
        });
      });
  };

  return (
    <>
      <NavbarPage />
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="bg-white p-8 rounded shadow-md w-96" >
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="loginType" className="block text-gray-600">Login as</label>
            <select
              id="loginType"
              className="w-full px-3 py-2 border rounded-md"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
