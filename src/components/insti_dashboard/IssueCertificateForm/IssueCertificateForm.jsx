import { useState } from "react";
import axios from "axios";
import "./issuecertificateform.css";
import { issueCredential } from "../../../webr";
import Papa from "papaparse";

const IssueCertificateForm = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    course: "",
    date: "",
    walletAddress: "",
  });

  const [csvData, setCsvData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isCsvMode, setIsCsvMode] = useState(false);

  // Handle CSV file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (err) => {
          setError("Failed to parse CSV file.");
          console.error(err);
        },
      });
    } else {
      setError("Please upload a valid CSV file.");
    }
  };

  // Function to issue certificates from CSV data
  const issueCertificatesFromCsv = async () => {
    try {
      for (const row of csvData) {
        const { studentName, course, date, walletAddress } = row;
        if (!studentName || !course || !date || !walletAddress) {
          setError("CSV is missing required fields.");
          continue;
        }

        await axios.post("http://localhost:5000/save-metadata", {
          studentName,
          course,
          date,
          walletAddress,
        });

        console.log(`Form data for ${studentName} saved to metadata.json`);

        await issueCredential();
        console.log(`Credential issued successfully for ${studentName}`);

        await axios.post("http://localhost:5000/run-insert-metadata");
        console.log(`Metadata insertion triggered for ${studentName}.`);

        await axios.post("http://localhost:5000/run-query-table");
        console.log(`Table queried successfully for ${studentName}.`);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("There was an error processing the CSV data", error);
    }
  };

  // Function to issue a single certificate
  const issueSingleCertificate = async () => {
    try {
      await axios.post("http://localhost:5000/save-metadata", formData);
      console.log("Form data has been saved to metadata.json");

      await issueCredential();
      console.log("Credential issued successfully");

      setIsSubmitted(true);
      setFormData({
        studentName: "",
        course: "",
        date: "",
        walletAddress: "",
      });

      await axios.post("http://localhost:5000/run-insert-metadata");
      console.log("Metadata insertion triggered.");

      await axios.post("http://localhost:5000/run-query-table");
      console.log("Table queried successfully.");
    } catch (error) {
      console.error("There was an error saving the form data", error);
    }
  };

  // Handle form submission for manual data
  const handleManualSubmit = (e) => {
    e.preventDefault();
    issueSingleCertificate();
  };

  // Handle form submission for CSV data
  const handleCsvSubmit = (e) => {
    e.preventDefault();
    if (csvData.length > 0) {
      issueCertificatesFromCsv();
    } else {
      setError("No CSV data available. Please upload a CSV file.");
    }
  };

  const handleClosePopup = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="issue-certificate-form-insti">
      <h2>Issue Certificate</h2>
      {error && <p className="error">{error}</p>}

      <div className="toggle-container">
        <button
          className={`toggle-btn ${!isCsvMode ? "active" : ""}`}
          onClick={() => setIsCsvMode(false)}
        >
          Single Certificate
        </button>
        <button
          className={`toggle-btn ${isCsvMode ? "active" : ""}`}
          onClick={() => setIsCsvMode(true)}
        >
          Upload CSV
        </button>
      </div>

      {isCsvMode ? (
        <div className="csv-upload-section">
          <label>Upload CSV File</label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleCsvSubmit}>Issue Certificates from CSV</button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="form-group-insti">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={(e) =>
                setFormData({ ...formData, studentName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Date</label>
            <input
              type="number"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={(e) =>
                setFormData({ ...formData, walletAddress: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Issue Single Certificate</button>
        </form>
      )}

      {isSubmitted && (
        <div className="popup">
          <div className="popup-content">
            <h3>Certificates Issued Successfully!</h3>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCertificateForm;
