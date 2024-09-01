import { Route, Routes } from "react-router-dom";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import GetWalletAddress from "../wallet/wallet";
import "./maincontent.css";

const MainContent = () => {
  return (
    <div className="main-content-insti">
      <Routes>
        <Route path="walletaddress" element={<GetWalletAddress />} />
        <Route path="issue" element={<IssueCertificateForm />} />
        <Route path="certificates" element={<CertificateList />} />
      </Routes>
    </div>
  );
};

export default MainContent;
