import React from "react";
import { Route, Routes } from "react-router-dom";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import "./maincontent.css";

const MainContent = () => {
  return (
    <div className="main-content">
      <Routes>
        {/* Student Routes */}
        <Route path="issue" element={<IssueCertificateForm />} />
        <Route path="certificates" element={<CertificateList />} />
      </Routes>
    </div>
  );
};

export default MainContent;
