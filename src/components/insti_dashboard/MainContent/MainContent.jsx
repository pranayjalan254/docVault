import React from "react";
import { Route, Routes } from "react-router-dom";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import "./maincontent.css";

const MainContent = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/dashboard/issue" component={IssueCertificateForm} />
        <Route path="/dashboard/certificates" component={CertificateList} />
      </Routes>
    </div>
  );
};

export default MainContent;
