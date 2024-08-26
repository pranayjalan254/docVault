import { connectToTableland } from './tableland/tableland.mjs';
import fs from 'fs';

async function queryTable() {
    try {
        // Connect to Tableland
        const db = await connectToTableland();

        // Load table name from the file
        const tableNameData = JSON.parse(fs.readFileSync('tableName.json', 'utf8'));
        const tableName = tableNameData.tableName;

        // Query the table to check its contents
        const result = await db
            .prepare(`SELECT * FROM ${tableName};`)
            .all();

        console.log("Query result:", result);

        // Detailed inspection
        if (Array.isArray(result)) {
            console.log("Table contents:");
            result.forEach(row => {
                console.log(row);
            });
        } else {
            console.log("No data found or incorrect result format.");
        }

    } catch (error) {
        console.error("Failed to query table:", error);
        throw error;
    }
}

queryTable();
