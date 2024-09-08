import { connectToTableland } from "./tableland/tableland.mjs";

export async function queryTable() {
  try {
    // Connect to Tableland
    const db = await connectToTableland();
    const tableName = "certificates_11155111_1801";
    const result = await db.prepare(`SELECT * FROM ${tableName};`).all();
    return result;
  } catch (error) {
    console.error("Failed to query table:", error);
    throw error;
  }
}
