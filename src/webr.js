import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
import { loadData } from "./parse.js";
import { web3auth } from "./components/web3auth/Web3modal.tsx";

// Function to issue a credential using Web3Auth
export async function issueCredential() {
  console.log(`Issuing credential...`);

  try {
    // Connect using Web3Auth
    const web3authProvider = await web3auth.connect();
    const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
    const signer = ethersProvider.getSigner();

    // Load the contract using the signer
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Load data from your data parsing function
    const { WALLET_ADDRESS, COURSE, DATE } = await loadData();

    // Validate the wallet address format
    if (!ethers.utils.isAddress(WALLET_ADDRESS)) {
      throw new Error(`Invalid Ethereum address: ${WALLET_ADDRESS}`);
    }

    // Issue credential by calling the contract method
    const transactionResponse = await contract.issueCredential(
      WALLET_ADDRESS,
      COURSE,
      ethers.BigNumber.from(DATE) // Ensure DATE is in a valid format
    );

    // Wait for the transaction to be mined
    await listenForTransactionMine(transactionResponse, ethersProvider);
  } catch (error) {
    console.log("Error issuing credential:", error);
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
