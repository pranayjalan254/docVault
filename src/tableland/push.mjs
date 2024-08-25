import { connectToTableland, createTable, insertMetadata } from './tableland.mjs';
import {db, tableName} from './n.mjs';
import fs from 'fs';
async function main2() {
    try {

        // Read metadata from JSON file
        const metadataPath = './metadata.json'; // Path to your JSON file
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

        // Extract metadata values
        const { Studentname, course, date, walletaddress } = metadata;

        // Insert metadata into Tableland
        await insertMetadata(db, tableName, Studentname, course, date, walletaddress);

        console.log("Metadata insertion completed successfully");
    } catch (error) {
        console.error("An error occurred:");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        if (error.cause) {
            console.error("Caused by:", error.cause);
        }
    }
}
main2();