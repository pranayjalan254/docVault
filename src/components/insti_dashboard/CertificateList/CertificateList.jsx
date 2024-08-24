import React from "react";
import "./certificatelist.css";

const CertificateList = () => {
  // Replace with actual data from your system
  const certificates = [
    {
      id: 1,
      studentName: "John Doe",
      course: "Blockchain 101",
      date: "2023-08-01",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      course: "Web3 Development",
      date: "2023-08-15",
    },
  ];

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
          {certificates.map((cert) => (
            <tr key={cert.id}>
              <td>{cert.studentName}</td>
              <td>{cert.course}</td>
              <td>{cert.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateList;
