import React, { useState } from "react";
import axios from "axios";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend
      await axios.post("http://localhost:5000/save-metadata", {
        studentName: formData.studentName,
        course: formData.course,
        date: formData.date,
        walletAddress: formData.walletAddress,
      });

      console.log("Form data has been saved to metadata.json");

      // Clear the form fields after successful submission
      setFormData({
        studentName: "",
        course: "",
        date: "",
        walletAddress: "",
      });
    } catch (error) {
      console.error("There was an error saving the form data", error);
    }
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
