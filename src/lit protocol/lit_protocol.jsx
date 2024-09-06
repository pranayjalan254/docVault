import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "../ethers-5.6.esm.min.js";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import { LitNetwork } from "@lit-protocol/constants";
import { web3auth } from "../components/web3auth/Web3modal";
import { useFormData } from "../components/insti_dashboard/IssueCertificateForm/FormData.jsx";
import { chainConfig, datilConfig } from "../components/web3auth/Web3modal.tsx";
export class Lit {
  litNodeClient;
  chain = "sepolia";
  provider;
  signer;
  currentAccount;

  async connect() {
    console.log("Connecting to Lit Protocol...");
    try {
      // Connect to Lit Protocol
      const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        checkNodeAttestation: true,
        litNetwork: LitNetwork.Datil,
        debug: true,
        connectTimeout: 60000,
        retryTimeout: 5000,
        maxRetries: 3,
      });
      await litNodeClient.connect();
      this.litNodeClient = litNodeClient;
      console.log("Successfully connected to Lit Protocol");

      //   await window.ethereum.request({ method: "eth_requestAccounts" });
      this.provider = new ethers.providers.Web3Provider(web3auth.provider);
      this.signer = this.provider.getSigner();
      this.currentAccount = await this.signer.getAddress();

      console.log(
        "Connected to Ethereum. Current account:",
        this.currentAccount
      );
    } catch (error) {
      console.error("Error during connection:", error);
      throw error;
    }
  }
  async switchNetwork(network) {
    try {
      let newChainConfig;

      if (network === "sepolia") {
        newChainConfig = chainConfig;
      } else if (network === "datil") {
        newChainConfig = datilConfig;
      } else {
        throw new Error("Unsupported network!");
      }
      await web3auth.configureAdapter({
        chainConfig: newChainConfig,
      });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  }

  async getSessionSignatures() {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authNeededCallback = async (params) => {
      const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

      if (
        !params.uri ||
        !params.expiration ||
        !params.resourceAbilityRequests
      ) {
        throw new Error("Missing required parameters for session signature.");
      }

      const siweMessage = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: this.currentAccount,
        nonce: latestBlockhash,
        litNodeClient: this.litNodeClient,
      });

      const authSig = await generateAuthSig({
        signer: this.signer,
        toSign: siweMessage,
      });

      return authSig;
    };

    const resourceAbilityRequests = [
      {
        resource: new LitAccessControlConditionResource("*"),
        ability: LitAbility.AccessControlConditionDecryption,
      },
    ];

    try {
      console.log("Getting session signatures...");
      const sessionSigs = await this.litNodeClient.getSessionSigs({
        chain: this.chain,
        resourceAbilityRequests,
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

      if (!sessionSigs) {
        throw new Error("Failed to get valid session signatures.");
      }
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
      console.log("Decrypted data:", decryptedString);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Error during decryption:", error.message);
      throw error;
    }
  }

  async encrypt(studentData, walletAddress) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "sepolia",
        method: "",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: "=",
          value: walletAddress,
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
}
export function useEncryptData() {
  const { formData } = useFormData();
  const encryptData = async () => {
    const lit = new Lit();
    await lit.connect();
    const studentData = {
      walletAddress: formData.walletAddress,
      studentName: formData.studentName,
      course: formData.course,
      date: formData.date,
      contact: formData.contact,
      add: formData.add,
    };
    return await lit.encrypt(studentData, studentData.address);
  };
  return { encryptData };
}
