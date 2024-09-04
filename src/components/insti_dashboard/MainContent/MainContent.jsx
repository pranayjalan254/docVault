import { Route, Routes } from "react-router-dom";
import IssueCertificateForm from "../IssueCertificateForm/IssueCertificateForm";
import CertificateList from "../CertificateList/CertificateList";
import GetWalletAddress from "../wallet/wallet";
import PaymentForm from "../reward/Reward";
import Money from "../money/Money";
import "./maincontent.css";

const MainContent = () => {
  return (
    <div className="main-content-insti">
      <Routes>
        <Route path="walletaddress" element={<GetWalletAddress />} />
        <Route path="issue" element={<IssueCertificateForm />} />
        <Route path="certificates" element={<CertificateList />} />
        <Route path="reward" element={<PaymentForm />} />
        <Route path="money" element={<Money />} />
      </Routes>
    </div>
  );
};

export default MainContent;
