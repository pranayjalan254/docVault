import { Route, Routes } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import HeroSection from "../Hero/Hero";
import CertificateList from "../CertificateList/CertificateList";
import GetWalletAddress from "../wallet/wallet";
import Money from "../money/Money";
import "./dashboard.css";

function Stud_dashboard() {
  return (
    <div className="dashboard-container-stud">
      <Navbar />
      <div className="dashboard-content-stud">
        <Sidebar />
        <div className="main-content-stud">
          <HeroSection title="Welcome to Your Dashboard" />
          <Routes>
            <Route path="/money" element={<Money />} />
            <Route path="/walletaddress" element={<GetWalletAddress />} />
            <Route path="/certificates" element={<CertificateList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Stud_dashboard;
