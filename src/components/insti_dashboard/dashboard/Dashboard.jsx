import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import Hero from "../hero/Hero";
import "./dashboard.css";

function Insti_dashboard() {
  const location = useLocation();

  // Show the hero section only when no specific path is selected (default dashboard view)
  const showHeroSection = location.pathname === "/insti-dashboard";

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          {showHeroSection && (
            <Hero
              title="Welcome to Your Dashboard"
              subtitle="Manage your credentials effortlessly."
            />
          )}
          <Routes>
            <Route path="issue" element={<IssueCertificateForm />} />
            <Route path="certificates" element={<CertificateList />} />
            <Route path="profile" element={<div>Manage Profile Page</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Insti_dashboard;
