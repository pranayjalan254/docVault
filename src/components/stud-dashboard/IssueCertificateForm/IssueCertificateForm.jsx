import React, { useState } from "react";
import "./issuecertificateform.css";

const IssueCertificateForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    course: "",
    date: "",
    walletAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., calling the smart contract to issue the certificate)
    console.log(formData);
  };

  return (
    <div className="issue-certificate-form">
      <h2>Issue Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Issue Certificate</button>
      </form>
    </div>
  );
};

export default IssueCertificateForm;
