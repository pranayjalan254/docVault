import { connectToTableland } from "./tableland.mjs";
import { database } from "../firebaseConfig";
import { doc, getDoc, collection } from "firebase/firestore";
import { insertintotable } from "../parse"; 
export async function insertMetadata() {
  try {
    // Load the table name from file
    const tableName = "certificates_11155111_1801";

    // Load metadata from JSON file
    // const metadataPath = path.join('./tableland/metadata.json');
    // const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    const collecRef = collection(database, "credential");
    const docRef = doc(collecRef, "1"); // Assuming "1" is the constant ID you're using for overwriting
    const encryptedDataraw = await getDoc(docRef);

    if (encryptedDataraw.exists()) {
      console.log("Document data:", encryptedDataraw.data());
    } else {
      console.log("No such document!");
      throw new Error("No such document in Firestore.");
    }

    // Validate required fields
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
