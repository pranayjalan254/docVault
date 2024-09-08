const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
app.use(cors());
app.use(express.json());

// Save Metadata Route
app.post("/save-metadata", (req, res) => {
  const formData = req.body;
  const jsonData = JSON.stringify(formData, null, 2);
  const filePath = path.join(__dirname, "tableland/metadata.json");

  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Failed to save metadata:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error saving metadata" });
    }
    res.status(200).json({
      success: true,
      message: "Form data has been saved to metadata.json",
    });
  });
});

// Fetch Metadata Route
app.get("/api/metadata", (req, res) => {
  const filePath = path.join(__dirname, "tableland/metadata.json");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending metadata.json:", err);
      res
        .status(500)
        .json({ success: false, message: "Error loading metadata" });
    }
  });
});

// Insert Metadata Route
app.post("/run-insert-metadata", async (req, res) => {
  try {
    const { insertMetadata } = await import(
      "./src/tableland/insertMetadata.mjs"
    );
    await insertMetadata();
    res
      .status(200)
      .json({ success: true, message: "Metadata inserted successfully" });
  } catch (error) {
    console.error("Error running insertMetadata:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to insert metadata" });
  }
});

// Query Table Route
(async () => {
  const { queryTable } = await import("./src/queryTable.mjs");
  app.post("/run-query-table", async (req, res) => {
    try {
      await queryTable();
      res.status(200).json({
        success: true,
        message: "Table queried successfully and data saved.",
      });
    } catch (error) {
      console.error("Error querying table:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to query table." });
    }
  });
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
