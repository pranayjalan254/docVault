import { Database } from "@tableland/sdk";
import { Wallet, ethers } from "ethers";

export async function connectToTableland() {
  try {
    const walletData = {
      address: import.meta.env.VITE_WALLET_ADDRESS,
      privateKey: import.meta.env.VITE_WALLET_PRIVATE_KEY,
    };
    const providerUrl = import.meta.env.VITE_RPC_URL;
    const provider = new ethers.JsonRpcProvider(providerUrl);
    const wallet = new Wallet(walletData.privateKey).connect(provider);

    console.log("Using wallet address:", wallet.address);
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} MATIC`);

    // Test the connection
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name);

    // Connect to the database using the signer
    const db = new Database({ signer: wallet });

    console.log("Connected to Tableland");
    return db;
  } catch (error) {
    console.error("Failed to connect to Tableland:", error);
    throw error;
  }
}
