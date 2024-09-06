import { useEffect, useState } from "react";
import { web3auth } from "../../web3auth/Web3modal";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./certificatelist.css";
import { Lit } from "../../../lit protocol/lit_protocol";
import axios from "axios";

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decryptionError, setDecryptionError] = useState(null); // State to track decryption error
  const [selectedCertIndex, setSelectedCertIndex] = useState(null); // Track certificate index for popup

  // Fetch wallet address on component load
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

  // Fetch certificates after wallet address is loaded
  useEffect(() => {
    if (!userWalletAddress) return;

    const fetchCertificates = async () => {
      try {
        await axios.post("http://localhost:5000/run-query-table");
        const response = await fetch("/fetchedCertificates.json");
        if (!response.ok) throw new Error("Failed to fetch certificates.");

        const data = await response.json();
        const fetchedCertificates = data.results || [];

        // Filter certificates for the user's wallet address
        const filteredCertificates = fetchedCertificates.filter((cert) => {
          return (
            cert &&
            cert.accessControlConditions &&
            cert.accessControlConditions[0] &&
            cert.accessControlConditions[0].returnValueTest &&
            cert.accessControlConditions[0].returnValueTest.value ===
              userWalletAddress
          );
        });

        setCertificates(filteredCertificates);
      } catch (error) {
        setError("Failed to fetch certificates.");
        console.error(error);
      }
    };

    fetchCertificates();
  }, [userWalletAddress]);

  const decryptCertificate = async (cert, index) => {
    try {
      const lit = new Lit();
      await lit.connect();
      const decryptedCert = await lit.decrypt(cert);
      setCertificates((prevCerts) => {
        const newCerts = [...prevCerts];
        newCerts[index] = { ...newCerts[index], decryptedCert };
        return newCerts;
      });
    } catch (error) {
      console.error("Failed to decrypt certificate:", error);
      setSelectedCertIndex(index);
      setDecryptionError("Failed to decrypt this certificate.");
    }
  };

  const closePopup = () => {
    setSelectedCertIndex(null);
    setDecryptionError(null);
  };

  if (loading) return <p>Loading wallet address...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="certificate-list">
      <h2>Issued Certificates</h2>
      <table>
        <thead>
          <tr>
            <th>Wallet Address</th>
            <th>Student Name</th>
            <th>Course</th>
            <th>Date</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <tr key={index}>
                {/* Before decryption, show placeholders */}
                <td>
                  {cert.decryptedCert
                    ? `${cert.decryptedCert.address.slice(0, 4)}....`
                    : "Encrypted"}
                </td>
                <td>
                  {cert.decryptedCert ? cert.decryptedCert.name : "Encrypted"}
                </td>
                <td>
                  {cert.decryptedCert ? cert.decryptedCert.course : "Encrypted"}
                </td>
                <td>
                  {cert.decryptedCert ? cert.decryptedCert.date : "Encrypted"}
                </td>
                <td>
                  {cert.decryptedCert
                    ? cert.decryptedCert.contact
                    : "Encrypted"}
                </td>
                <td>
                  {cert.decryptedCert
                    ? cert.decryptedCert.resaddress
                    : "Encrypted"}
                </td>
                <td>
                  <button onClick={() => decryptCertificate(cert, index)}>
                    Decrypt Certificate
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                No certificates found for this wallet address.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup for decryption error */}
      {selectedCertIndex !== null && decryptionError && (
        <div className="popup">
          <div className="popup-content">
            <p>{decryptionError}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateList;
