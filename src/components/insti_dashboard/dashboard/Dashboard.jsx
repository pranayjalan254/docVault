import { Route, Routes } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import Hero from "../hero/Hero";
import "./dashboard.css";
import GetWalletAddress from "../wallet/wallet";

function Insti_dashboard() {
  return (
    <div className="dashboard-container-insti">
      <Navbar />
      <div className="dashboard-content-insti">
        <Sidebar />
        <div className="main-content-insti">
          <Hero
            title="Welcome to Your Dashboard"
            subtitle="Manage your credentials effortlessly."
          />
          <Routes>
            <Route path="/walletaddress" element={<GetWalletAddress />} />
            <Route path="/issue" element={<IssueCertificateForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Insti_dashboard;
