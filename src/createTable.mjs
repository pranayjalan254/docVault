import { connectToTableland } from "./tableland/tableland.mjs";
import fs from "fs";

async function createTable() {
  try {
    // Connect to Tableland
    const db = await connectToTableland();

    // Create the table with the new schema
    const prefix = "certificates";
    const { meta: create } = await db
      .prepare(
        `CREATE TABLE ${prefix} (
                    
                    ciphertext TEXT NOT NULL,
                    dataToEncryptHash TEXT NOT NULL,
                    accessControlConditions TEXT NOT NULL

                );`
      )
      .run();

    await create.txn?.wait();
    const tableName = create.txn?.names[0];
    console.log("Table created:", tableName);

    // Save the table name to a file
    fs.writeFileSync("tableName.json", JSON.stringify({ tableName }), "utf8");
  } catch (error) {
    console.error("Failed to create table:", error);
    throw error;
  }
}

createTable();
