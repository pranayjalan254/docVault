// saveCertificates.js
import { connectToTableland } from './tableland/tableland.mjs';
import fs from 'fs';
import path from 'path';

async function queryTable() {
    try {
        // Connect to Tableland
        const db = await connectToTableland();

        // Load table name from the file
        const tableNameData = JSON.parse(fs.readFileSync('tableName.json', 'utf8'));
        const tableName = tableNameData.tableName;

        // Query the table to get all rows
        const result = await db
            .prepare(`SELECT * FROM ${tableName};`)
            .all();

        // Ensure the public directory exists
        const publicDir = path.resolve('public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        // Save result to fetchedCertificates.json
        const filePath = path.join(publicDir, 'fetchedCertificates.json');
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

        console.log("Data saved to fetchedCertificates.json at:", filePath);

    } catch (error) {
        console.error("Failed to query table:", error);
        throw error;
    }
}

queryTable();
