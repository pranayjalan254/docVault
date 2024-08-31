import React, { useEffect, useState } from "react";
import "./certificatelist.css";


const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const userWalletAddress = "WERTYJ"; // Set the wallet address for testing

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Fetch the table data from the JSON file
        const response = await fetch("/fetchedCertificates.json");
        const fetchedCertificates = await response.json();
      

        // Filter certificates based on the user's wallet address
        const filteredCertificates = fetchedCertificates.filter(
          (cert) => cert.walletaddress === userWalletAddress
          
        );
        

        setCertificates(filteredCertificates);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };

    fetchCertificates();
  }, [userWalletAddress]);

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
            certificates.map((cert) => (
              <tr key={cert.course}>
                <td>{cert.Studentname}</td>
                <td>{cert.course}</td>
                <td>{cert.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No certificates found for this wallet address.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateList;
