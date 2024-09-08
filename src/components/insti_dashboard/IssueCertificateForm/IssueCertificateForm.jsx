import { useState } from "react";
import "./issuecertificateform.css";
import { issueCredential } from "../../../webr";
import Papa from "papaparse";
import { useFormData } from "./FormData";
import { Lit } from "../../../lit protocol/lit_protocol.jsx";
import { app, database } from "../../../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { insertMetadata } from "../../../tableland/insertMetadata.mjs";

const IssueCertificateForm = () => {
  const id = "1";
  const collecRef = collection(database, "credential");
  const { formData, setFormData } = useFormData();
  const [csvData, setCsvData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isCsvMode, setIsCsvMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      for (const row of csvData) {
        const { studentName, course, date, walletAddress, contact, add } = row;
        if (
          !studentName ||
          !course ||
          !date ||
          !walletAddress ||
          !contact ||
          !add
        ) {
          setError("CSV is missing required fields.");
          continue;
        }

        const formData = {
          studentName,
          course,
          date,
          contact,
          add,
          walletAddress,
        };

        // Encrypt data
        const lit = new Lit();
        await lit.connect();
        const encryptedData = await lit.encrypt(
          formData,
          formData.walletAddress
        );

        // Save metadata
        const certDocRef = doc(collecRef, id);

        // Save encrypted data to Firestore
        await setDoc(certDocRef, {
          ciphertext: encryptedData.ciphertext,
          datatoEncryptHash: encryptedData.dataToEncryptHash,
          accessControlConditions: encryptedData.accessControlConditions,
        });
        console.log("Data saved to Firebase");

        // Issue credential
        const issueCredentialResponse = await issueCredential(formData);
        if (!issueCredentialResponse.success) {
          setError(`Failed to issue credential for ${studentName}.`);
          continue;
        }
        console.log(`Credential issued successfully for ${studentName}`);
        await insertMetadata();
        console.log(`Metadata inserted for ${studentName}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      setError("There was an error processing the CSV data");
      console.error("There was an error processing the CSV data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to issue a single certificate
  const issueSingleCertificate = async () => {
    setIsLoading(true);
    try {
      const lit = new Lit();
      await lit.connect();
      const encryptedData = await lit.encrypt(formData, formData.walletAddress);

      // Save metadata
      const certDocRef = doc(collecRef, id);

      // Save encrypted data to Firestore
      await setDoc(certDocRef, {
        ciphertext: encryptedData.ciphertext,
        datatoEncryptHash: encryptedData.dataToEncryptHash,
        accessControlConditions: encryptedData.accessControlConditions,
      });
      console.log("Data saved to Firebase");

      // Issue credential
      const issueCredentialResponse = await issueCredential(formData);
      if (!issueCredentialResponse.success) {
        setError("Failed to issue credential.");
        return;
      }
      console.log("Credential issued successfully");
      console.log("Metadata inserted");

      setIsSubmitted(true);
      setFormData({
        studentName: "",
        course: "",
        date: "",
        contact: "",
        add: "",
        walletAddress: "",
      });
    } catch (error) {
      setError("There was an error saving the form data");
      console.error("There was an error saving the form data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    issueSingleCertificate();
  };

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
          <button onClick={handleCsvSubmit} disabled={isLoading}>
            {isLoading
              ? "Issuing Certificates..."
              : "Issue Certificates from CSV"}
          </button>
          <h4>Note: Please add enough ETH to issue all certificates</h4>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit}>
          <div className="form-group-insti">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName || ""}
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
              value={formData.course || ""}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Date of Issuance</label>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Contact</label>
            <input
              type="number"
              name="contact"
              value={formData.contact || ""}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Residential Address</label>
            <input
              type="text"
              name="add"
              value={formData.add || ""}
              onChange={(e) =>
                setFormData({ ...formData, add: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group-insti">
            <label>Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress || ""}
              onChange={(e) =>
                setFormData({ ...formData, walletAddress: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Issuing Certificate..." : "Issue Certificate"}
          </button>
          <h4>Note: Please add enough ETH to issue the certificate</h4>
        </form>
      )}

      {isSubmitted && (
        <div className="popup">
          <div className="popup-content">
            <h3>Certificate issued successfully</h3>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCertificateForm;
