const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/save-metadata", (req, res) => {
  const formData = req.body;

  const jsonData = JSON.stringify(formData, null, 2);
  const filePath = path.join(__dirname, "tableland/metadata.json");

  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Failed to save metadata:", err);
      return res.status(500).send("Error saving metadata");
    }
    res.send("Form data has been saved to metadata.json");
  });
});

app.get("/api/metadata", (req, res) => {
  const filePath = path.join(__dirname, "tableland/metadata.json");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending metadata.json:", err);
      res.status(500).send("Error loading metadata");
    }
  });
});

app.post("/run-insert-metadata", async (req, res) => {
  try {
    const { insertMetadata } = await import(
      "../src/tableland/insertMetadata.mjs"
    );
    await insertMetadata();
    res.status(200).send("Metadata inserted successfully");
  } catch (error) {
    console.error("Error running insertMetadata:", error);
    res.status(500).send("Failed to insert metadata");
  }
});

(async () => {
  const { queryTable } = await import("./queryTable.mjs");

  // Now you can use queryTable as needed
  app.post("/run-query-table", async (req, res) => {
    try {
      await queryTable();
      res.status(200).send("Table queried successfully and data saved.");
    } catch (error) {
      console.error("Error querying table:", error);
      res.status(500).send("Failed to query table.");
    }
  });
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
