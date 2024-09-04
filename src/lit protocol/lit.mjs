import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "./ethers-5.6.esm.min.js";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitContracts } from "@lit-protocol/contracts-sdk";

import useFormData from "./formDataExport";

class Lit {
  litNodeClient;
  chain = "sepolia";
  provider;
  signer;
  currentAccount;

  async connect() {
    console.log("Connecting to Lit Protocol and MetaMask...");
    try {
      // Connect to Lit Protocol
      this.litNodeClient = new LitJsSdk.LitNodeClient({
        litNetwork: "datil-dev",
        debug: true,
      });
      await this.litNodeClient.connect();
      console.log("Successfully connected to Lit Protocol");

      // Connect to MetaMask
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.currentAccount = await this.signer.getAddress();
        console.log(
          "Connected to MetaMask. Current account:",
          this.currentAccount
        );
      } else {
        throw new Error("MetaMask not detected");
      }
    } catch (error) {
      console.error("Error during connection:", error);
      throw error;
    }
  }

  async getCurrentAccount() {
    if (!this.currentAccount) {
      throw new Error(
        "Not connected to MetaMask. Please call connect() first."
      );
    }
    return this.currentAccount;
  }

  async encrypt(studentData, allowedAddress) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: this.chain,
        method: "eth_getBalance",
        parameters: [allowedAddress, "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "0",
        },
      },
    ];

    try {
      console.log("Encrypting data...");
      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          chain: this.chain,
          dataToEncrypt: JSON.stringify(studentData),
        },
        this.litNodeClient
      );
      console.log("Data encrypted successfully");
      return { ciphertext, dataToEncryptHash, accessControlConditions };
    } catch (error) {
      console.error("Error during encryption:", error);
      throw error;
    }
  }

  async getSessionSignatures() {
    const authNeededCallback = async ({
      chain,
      resources,
      expiration,
      uri,
    }) => {
      try {
        const siweMessage = await createSiweMessageWithRecaps({
          domain: window.location.hostname,
          address: this.currentAccount,
          statement: "Sign this message to access the Lit Protocol.",
          uri,
          version: "1",
          chainId: "1",
          resources,
          expiration,
        });

        const signature = await this.signer.signMessage(siweMessage);

        return {
          sig: signature,
          derivedVia: "web3.eth.personal.sign",
          signedMessage: siweMessage,
          address: this.currentAccount,
        };
      } catch (error) {
        console.error("Error in authNeededCallback:", error);
        throw error;
      }
    };

    const chain = this.chain;
    const resourceAbilityRequests = [
      {
        resource: new LitAccessControlConditionResource("*"),
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ];

    try {
      console.log("Getting session signatures...");
      const sessionSigs = await this.litNodeClient.getSessionSigs({
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours
        chain,
        resourceAbilityRequests,
        switchChain: false,
        authNeededCallback,
      });
      console.log("Session signatures obtained successfully");
      return sessionSigs;
    } catch (error) {
      console.error("Error getting session signatures:", error);
      throw error;
    }
  }

  async decrypt(encryptedData) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    try {
      const sessionSigs = await this.getSessionSignatures();

      console.log("Decrypting data...");
      const decryptedString = await LitJsSdk.decryptToString(
        {
          accessControlConditions: encryptedData.accessControlConditions,
          ciphertext: encryptedData.ciphertext,
          dataToEncryptHash: encryptedData.dataToEncryptHash,
          chain: this.chain,
          sessionSigs,
        },
        this.litNodeClient
      );
      console.log("Data decrypted successfully");

      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Error during decryption:", error);
      throw error;
    }
  }
}

async function main() {
  const lit = new Lit();
  const { formData } = useFormData();

  try {
    await lit.connect();

    const currentAccount = await lit.getCurrentAccount();
    console.log(
      "Current account (which would pay for gas if transactions were sent):",
      currentAccount
    );

    const studentData = {
      address: formData.walletAddress,
      name: formData.studentName,
      course: formData.course,
      date: formData.date,
    };

    console.log("Encrypting data...");
    const encryptedData = await lit.encrypt(studentData, currentAccount);
    console.log("Data encrypted successfully");

    console.log("Attempting to decrypt data...");
    const decryptedData = await lit.decrypt(encryptedData);
    console.log("Decrypted data:", decryptedData);
  } catch (error) {
    console.error("An error occurred in the main function:", error);
  }
}

// Only run main() if this script is being run directly (not imported as a module)
if (typeof window !== "undefined" && !module.parent) {
  main().catch((error) => {
    console.error("Unhandled error in main:", error);
  });
}
