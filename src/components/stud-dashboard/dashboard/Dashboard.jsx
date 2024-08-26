import { Route, Routes } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import HeroSection from "../Hero/Hero";
import Profile from "../Profile/Profile";
import CertificateList from "../CertificateList/CertificateList";
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
            <Route path="/certificates" element={<CertificateList />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Stud_dashboard;
