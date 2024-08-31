import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";
import { loadData } from "./parse.js";

const connectButton = document.getElementById("connectButton");
const issueButton = document.getElementById("balanceButton");
const verifyButton = document.getElementById("withdrawButton");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask");
  }
}

export async function issueCredential() {
  console.log(`Issuing credential...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const { WALLET_ADDRESS, COURSE, DATE } = await loadData();

      // Validate the wallet address
      if (!ethers.utils.isAddress(WALLET_ADDRESS)) {
        throw new Error(`Invalid Ethereum address: ${WALLET_ADDRESS}`);
      }

      const transactionResponse = await contract.issueCredential(
        WALLET_ADDRESS,
        COURSE,
        ethers.BigNumber.from(DATE) // Assuming DATE is a timestamp
      );
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log("Error issuing credential:", error);
    }
  } else {
    issueButton.innerHTML = "Please install MetaMask";
  }
}

export async function verifyCredential() {
  console.log(`Verifying credential...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const { WALLET_ADDRESS } = await loadData();

      // Validate the wallet address
      if (!ethers.utils.isAddress(WALLET_ADDRESS)) {
        throw new Error(`Invalid Ethereum address: ${WALLET_ADDRESS}`);
      }

      const isValid = await contract.getCredentials(WALLET_ADDRESS);
      console.log(`Credential is ${isValid ? "valid" : "invalid"}`);
    } catch (error) {
      console.log("Error verifying credential:", error);
    }
  } else {
    verifyButton.innerHTML = "Please install MetaMask";
  }
}

export function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Initial connection attempt
connect();
