const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/save-metadata', (req, res) => {
    const formData = req.body;

    const jsonData = JSON.stringify(formData, null, 2);
    const filePath = path.join(__dirname, 'tableland/metadata.json');

    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
        if (err) {
            console.error("Failed to save metadata:", err);
            return res.status(500).send('Error saving metadata');
        }
        res.send('Form data has been saved to metadata.json');
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));