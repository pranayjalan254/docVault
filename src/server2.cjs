const express = require('express');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.post('/run-insert-metadata', async (req, res) => {
    try {
        const { insertMetadata } = await import('../src/tableland/insertMetadata.mjs');
        await insertMetadata();
        res.status(200).send('Metadata inserted successfully');
    } catch (error) {
        console.error("Error running insertMetadata:", error);
        res.status(500).send('Failed to insert metadata');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
