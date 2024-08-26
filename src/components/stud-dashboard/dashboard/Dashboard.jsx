import { Route, Routes } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import HeroSection from "../Hero/Hero";
import Profile from "../Profile/Profile";
import CertificateList from "../CertificateList/CertificateList";
import "./dashboard.css";

function Stud_dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <HeroSection title="Welcome to Your Dashboard" />
          <Routes>
            <Route path="/certificates" element={<CertificateList />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Stud_dashboard;
