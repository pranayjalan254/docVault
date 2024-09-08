import { connectToTableland } from "./tableland.mjs";
import { database } from "../firebaseConfig";
import { doc, getDoc, collection } from "firebase/firestore";
import { insertintotable } from "../parse";
export async function insertMetadata() {
  try {
    const tableName = "certificates_11155111_1801";
    const collecRef = collection(database, "credential");
    const docRef = doc(collecRef, "1");
    const encryptedDataraw = await getDoc(docRef);

    if (encryptedDataraw.exists()) {
      console.log("Document data:", encryptedDataraw.data());
    } else {
      console.log("No such document!");
      throw new Error("No such document in Firestore.");
    }

    const [ciphertext, dataToEncryptHash, accessControlConditions] =
      await insertintotable(encryptedDataraw.data());
    console.log(ciphertext, dataToEncryptHash, accessControlConditions);

    if (!ciphertext || !dataToEncryptHash || !accessControlConditions) {
      throw new Error("Metadata fields are missing or invalid");
    }

    // Connect to Tableland
    const db = await connectToTableland();

    // Insert metadata into the table
    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${tableName} (ciphertext, dataToEncryptHash, accessControlConditions) VALUES (?, ?, ?);`
      )
      .bind(
        ciphertext,
        dataToEncryptHash,
        JSON.stringify(accessControlConditions)
      )
      .run();

    await insert.txn?.wait();
    console.log("Metadata inserted:", insert.txn?.transactionHash);
  } catch (error) {
    console.error("Failed to insert metadata:", error);
    throw error;
  }
}
