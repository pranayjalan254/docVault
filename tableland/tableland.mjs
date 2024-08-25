import { Database } from '@tableland/sdk';
import { Wallet, ethers } from 'ethers';
import fs from 'fs';

export async function connectToTableland() {
    try {
        // Load wallet from file
        const walletData = JSON.parse(fs.readFileSync('wallet.json'));
        const providerUrl = "https://eth-sepolia.g.alchemy.com/v2/1i43szEwrnGCazSgHZSn3A3LHEeYUI8P";
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

export async function createTable(db) {
    try {
        const prefix = "degrees";
        const { meta: create } = await db
            .prepare(
                `CREATE TABLE ${prefix} (
                    id INTEGER PRIMARY KEY,
                    cid TEXT NOT NULL,
                    fileHash TEXT NOT NULL
                );`
            )
            .run();

        await create.txn?.wait();
        console.log("Table created:", create.txn?.transactionHash);
        return create.txn?.names[0]; // Return the table name
    } catch (error) {
        console.error("Failed to create table:", error);
        if (error.message.includes("insufficient funds")) {
            console.error("The wallet doesn't have enough MATIC to create a table.");
        }
        throw error;
    }
}

export async function insertMetadata(db, tableName, cid, fileHash) {
    try {
        const { meta: insert } = await db
            .prepare(
                `INSERT INTO ${tableName} (cid, fileHash) VALUES (?, ?);`
            )
            .bind(cid, fileHash)
            .run();

        await insert.txn?.wait();
        console.log("Metadata inserted:", insert.txn?.transactionHash);
        return insert.txn?.transactionHash;
    } catch (error) {
        console.error("Failed to insert metadata:", error);
        throw error;
    }
}
