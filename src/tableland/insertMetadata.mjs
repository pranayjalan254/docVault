import { connectToTableland } from './tableland.mjs';
import fs from 'fs';
import path from 'path';

export async function insertMetadata() {
    try {
        // Load the table name from file
        const tableName = JSON.parse(fs.readFileSync('tableName.json', 'utf8')).tableName;
        
        // Load metadata from JSON file
        const metadataPath = path.join('./tableland/metadata.json');
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

        // Log metadata for debugging
        console.log('Loaded metadata:', metadata);

        // Validate required fields
        const { ciphertext, dataToEncryptHash, accessControlConditions } = metadata;
        if (!ciphertext || !dataToEncryptHash || !accessControlConditions) {
            throw new Error('Metadata fields are missing or invalid');
        }

        // Connect to Tableland
        const db = await connectToTableland();

        // Insert metadata into the table
        const { meta: insert } = await db
            .prepare(
                `INSERT INTO ${tableName} (ciphertext, dataToEncryptHash, accessControlConditions) VALUES (?, ?, ?);`
            )
            .bind(ciphertext, dataToEncryptHash, JSON.stringify(accessControlConditions))
            .run();

        await insert.txn?.wait();
        console.log("Metadata inserted:", insert.txn?.transactionHash);
    } catch (error) {
        console.error("Failed to insert metadata:", error);
        throw error;
    }
}
