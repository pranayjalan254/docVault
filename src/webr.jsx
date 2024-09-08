import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
import { loadData, loadEncryptedData } from "./parse.jsx";
import { web3auth } from "./components/web3auth/Web3modal.tsx";
import { doc, getDoc, collection } from "firebase/firestore";
import { database } from "./firebaseConfig.js";

export async function issueCredential(formData) {
  console.log(`Issuing credential...`);

  try {
    // Connect using Web3Auth
    const web3authProvider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
    const signer = ethersProvider.getSigner();

    // Load the contract using the signer
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Load data from your data parsing function
    const [WALLET_ADDRESS, COURSE, DATE, CONTACT, ADD] =
      await loadData(formData);

    // Reference to the specific document in Firestore
    const collecRef = collection(database, "credential");
    const docRef = doc(collecRef, "1");
    const encryptedDataraw = await getDoc(docRef);

    // Load encrypted data details
    const [CIPHERTEXT, DATA_TO_ENCRYPT_HASH] = await loadEncryptedData(
      encryptedDataraw.data()
    );

    // Check if the Ethereum address is valid
    if (!ethers.utils.isAddress(WALLET_ADDRESS)) {
      throw new Error(`Invalid Ethereum address: ${WALLET_ADDRESS}`);
    }

    // Issue credential by calling the contract method
    const transactionResponse = await contract.issueCredential(
      WALLET_ADDRESS,
      CIPHERTEXT,
      DATA_TO_ENCRYPT_HASH
    );

    // Wait for the transaction to be mined
    await listenForTransactionMine(transactionResponse, ethersProvider);

    console.log("Credential issued successfully.");
    return { success: true, message: "Credential issued successfully" };
  } catch (error) {
    console.error("Error issuing credential:", error);
    return {
      success: false,
      message: `Error issuing credential: ${error.message}`,
    };
  }
}

// Function to listen for transaction mining using Web3Auth provider
export function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      // Listen for the transaction to be mined
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations.`
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
