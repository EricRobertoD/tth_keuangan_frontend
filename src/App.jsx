
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import FinanceDataPage from "./pages/Dashboard/FinanceDataPage.jsx";
import TransaksiDataPage from "./pages/Dashboard/TransaksiDataPage.jsx";
import ReleasePage from "./pages/Dashboard/ReleasePage.jsx";
import RealisasiPage from "./pages/Dashboard/RealisasiPage.jsx";
import TotalDataPage from "./pages/Dashboard/TotalDataPage.jsx";
import PenyerapanPage from "./pages/Dashboard/PenyerapanPage.jsx";
import TransaksiDataUserPage from "./pages/User/TransaksiDataUserPage.jsx";
import FinanceDataUserPage from "./pages/User/FinanceDataUserPage.jsx";
import TotalDataUserPage from "./pages/User/TotalDataUserPage.jsx";
import PenyerapanUserPage from "./pages/User/PenyerapanUserPage.jsx";
import DashboardUserPage from "./pages/User/DashboardUserPage.jsx";
import ManageUserPage from "./pages/Auth/ManageUserPage.jsx";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/LoginPage" element={<LoginPage />}></Route>
          <Route path="/DashboardPage" element={<DashboardPage />}></Route>
          <Route path="/FinanceDataPage" element={<FinanceDataPage />}></Route>
          <Route path="/TransaksiDataPage" element={<TransaksiDataPage />}></Route>
          <Route path="/ReleasePage" element={<ReleasePage />}></Route>
          <Route path="/RealisasiPage" element={<RealisasiPage />}></Route>
          <Route path="/TotalDataPage" element={<TotalDataPage />}></Route>
          <Route path="/PenyerapanPage" element={<PenyerapanPage />}></Route>
          <Route path="/TransaksiDataUserPage" element={<TransaksiDataUserPage />}></Route>
          <Route path="/FinanceDataUserPage" element={<FinanceDataUserPage />}></Route>
          <Route path="/TotalDataUserPage" element={<TotalDataUserPage />}></Route>
          <Route path="/PenyerapanUserPage" element={<PenyerapanUserPage />}></Route>
          <Route path="/DashboardUserPage" element={<DashboardUserPage />}></Route>
          <Route path="/ManageUserPage" element={<ManageUserPage />}></Route>



        </Routes>
      </BrowserRouter>
  )
}

export default App