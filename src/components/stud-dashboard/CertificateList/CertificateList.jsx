import { useEffect, useState } from "react";
import { web3auth } from "../../web3auth/Web3modal";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./certificatelist.css";

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const web3authProvider = await web3auth.connect();
        const ethersProvider = new ethers.providers.Web3Provider(
          web3authProvider
        );
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        setUserWalletAddress(address);
      } catch (error) {
        setError("Failed to connect to Web3Auth.");
        console.error("Error fetching wallet address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (!userWalletAddress) return;

    const fetchCertificates = async () => {
      try {
        const response = await fetch("/fetchedCertificates.json");
        if (!response.ok) throw new Error("Failed to fetch certificates.");

        const data = await response.json();
        const fetchedCertificates = data.results || [];
        const filteredCertificates = fetchedCertificates.filter(
          (cert) =>
            cert.walletaddress.toLowerCase() === userWalletAddress.toLowerCase()
        );

        setCertificates(filteredCertificates);
      } catch (error) {
        setError("Failed to fetch certificates.");
        console.error(error);
      }
    };

    fetchCertificates();
  }, [userWalletAddress]);

  if (loading) return <p>Loading wallet address...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="certificate-list">
      <h2>Issued Certificates</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Course</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <tr key={index}>
                <td>{cert.Studentname}</td>
                <td>{cert.course}</td>
                <td>{cert.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">
                No certificates found for this wallet address.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateList;
