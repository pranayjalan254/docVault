import { connectToTableland } from './tableland.mjs';
import fs from 'fs';

export async function insertMetadata() {
    try {
        // Load the table name from file
        const tableName = JSON.parse(fs.readFileSync('tableName.json', 'utf8')).tableName;

        // Connect to Tableland
        const db = await connectToTableland();

        // Load metadata from JSON file
        const metadata = JSON.parse(fs.readFileSync('./tableland/metadata.json', 'utf8'));

        // Insert metadata into the table
        const { Studentname, course, date, walletaddress } = metadata;
        const { meta: insert } = await db
            .prepare(
                `INSERT INTO ${tableName} (Studentname, course, date, walletaddress) VALUES (?, ?, ?, ?);`
            )
            .bind(Studentname, course, date, walletaddress)
            .run();

        await insert.txn?.wait();
        console.log("Metadata inserted:", insert.txn?.transactionHash);
    } catch (error) {
        console.error("Failed to insert metadata:", error);
        throw error;
    }
}
