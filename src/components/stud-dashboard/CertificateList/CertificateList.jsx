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
  const [decryptionError, setDecryptionError] = useState(null);
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);
  const [decryptingIndex, setDecryptingIndex] = useState(null);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

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
      setLoadingCertificates(true);
      try {
        await axios.post("http://localhost:5000/run-query-table");
        const response = await fetch("/fetchedCertificates.json");
        if (!response.ok) throw new Error("Failed to fetch certificates.");

        const data = await response.json();
        const fetchedCertificates = data.results || [];

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
      } finally {
        setLoadingCertificates(false);
      }
    };

    fetchCertificates();
  }, [userWalletAddress]);

  const decryptCertificate = async (cert, index) => {
    setDecryptingIndex(index);
    try {
      const lit = new Lit();
      await lit.connect();
      const decryptedCert = await lit.decrypt(cert);
      setCertificates((prevCerts) => {
        const newCerts = [...prevCerts];
        newCerts[index] = { ...newCerts[index], decryptedCert };
        return newCerts;
      });

      setDecryptionError(null);
    } catch (error) {
      console.error("Failed to decrypt certificate:", error);
      setDecryptionError("Failed to decrypt this certificate.");
    } finally {
      setDecryptingIndex(null);
      setSelectedCertIndex(index);
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
      {loadingCertificates ? (
        <p>Loading certificates...</p>
      ) : (
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
                  <td>
                    {cert.decryptedCert
                      ? `${cert.decryptedCert.walletAddress.slice(0, 4)}....`
                      : "Encrypted"}
                  </td>
                  <td>
                    {cert.decryptedCert
                      ? cert.decryptedCert.studentName
                      : "Encrypted"}
                  </td>
                  <td>
                    {cert.decryptedCert
                      ? cert.decryptedCert.course
                      : "Encrypted"}
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
                    {cert.decryptedCert ? cert.decryptedCert.add : "Encrypted"}
                  </td>
                  <td>
                    <button
                      onClick={() => decryptCertificate(cert, index)}
                      disabled={decryptingIndex === index}
                    >
                      {decryptingIndex === index
                        ? "Decrypting..."
                        : "Decrypt Certificate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No certificates found for this wallet address.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

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
