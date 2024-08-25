import { connectToTableland, createTable, insertMetadata } from './tableland.mjs';

import readline from 'readline';

async function main() {
    try {
        // Connect to Tableland
        const db = await connectToTableland();

        // Create the table on Tableland
        const tableName = await createTable(db);

        // Set up user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Ask for user input
        rl.question('Enter the CID: ', async (cid) => {
            rl.question('Enter the file hash: ', async (fileHash) => {
                // Insert metadata into Tableland
                await insertMetadata(db, tableName, cid, fileHash);

                console.log("Process completed successfully");
                rl.close();
            });
        });

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
