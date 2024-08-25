import { connectToTableland, createTable, insertMetadata } from './tableland.mjs';
import fs from 'fs';
export let db;
export let tableName;


async function main() {
    try {
        // Connect to Tableland
        const db = await connectToTableland();

        // Create the table on Tableland
        const tableName = await createTable(db);


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

main();
