import { Route, Routes } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import "./dashboard.css";

function Stud_dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/issue" element={<IssueCertificateForm />} />
          <Route path="/certificates" element={<CertificateList />} />
        </Routes>
      </div>
    </div>
  );
}

export default Stud_dashboard;
