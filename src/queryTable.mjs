import { connectToTableland } from "./tableland/tableland.mjs";

export async function queryTable() {
  try {
    // Connect to Tableland
    const db = await connectToTableland();

    // Load the table name from a variable (assuming you have it defined somewhere)
    const tableName = "certificates_11155111_1801"; // Replace with your actual table name

    // Query the table to get all rows
    const result = await db.prepare(`SELECT * FROM ${tableName};`).all();

    // Return the fetched result directly
    return result;
  } catch (error) {
    console.error("Failed to query table:", error);
    throw error;
  }
}
