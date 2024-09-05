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

export class Lit {
  litNodeClient;
  chain = "sepolia";
  provider;
  signer;
  currentAccount;

  async connect() {
    console.log("Connecting to Lit Protocol and Web3Auth...");
    try {
      // Connect to Lit Protocol
      const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
        alertWhenUnauthorized: false,
        litNetwork: LitNetwork.DatilTest,
        checkNodeAttestation: true,
        debug: true,
        connectTimeout: 30000,
      });
      await litNodeClient.connect();
      this.litNodeClient = litNodeClient;
      console.log("Successfully connected to Lit Protocol");

      // Check if Web3Auth is connected
      // const web3authProvider = await web3auth.connect();
      // Extract provider and signer from Web3Auth
      await window.ethereum.request({ method: "eth_requestAccounts" });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.currentAccount = await this.signer.getAddress();
      console.log(
        "Connected to Web3Auth. Current account:",
        this.currentAccount
      );
    } catch (error) {
      console.error("Error during connection:", error);
      throw error;
    }
  }

  async getSessionSignatures() {
    // Ensure connection to Lit Protocol
    if (!this.litNodeClient) {
      await this.connect();
    }

    const authNeededCallback = async (params) => {
      const latestBlockhash = await this.litNodeClient.getLatestBlockhash();

      // Validate required parameters
      if (
        !params.uri ||
        !params.expiration ||
        !params.resourceAbilityRequests
      ) {
        throw new Error("Missing required parameters for session signature.");
      }

      // Create the SIWE message
      const siweMessage = await createSiweMessageWithRecaps({
        uri: params.uri,
        expiration: params.expiration,
        resources: params.resourceAbilityRequests,
        walletAddress: this.currentAccount,
        nonce: latestBlockhash,
        litNodeClient: this.litNodeClient,
      });
      console.log("SIWE message:", siweMessage);

      // Generate the authSig
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
      console.log(sessionSigs);
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
      // Get session signatures
      const sessionSigs = await this.getSessionSignatures();
      console.log("Session signatures:", sessionSigs);

      if (!sessionSigs) {
        throw new Error("Failed to get valid session signatures.");
      }

      console.log("Encrypted data:", encryptedData);

      console.log("Decrypting data...");

      // Decrypt the data using Lit Protocol
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
  // Encrypt function as requested
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
        parameters: [":userAddress"],
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
      console.log("ciphertext:", ciphertext);
      console.log("dataToEncryptHash:", dataToEncryptHash);
      console.log("accessControlConditions:", accessControlConditions);
      return { ciphertext, dataToEncryptHash, accessControlConditions };
    } catch (error) {
      console.error("Error during encryption:", error);
      throw error;
    }
  }
}

// Example usage
export function useEncryptData() {
  const { formData } = useFormData();
  const encryptData = async () => {
    const lit = new Lit();
    await lit.connect();
    const studentData = {
      address: formData.walletAddress,
      name: formData.studentName,
      course: formData.course,
      date: formData.date,
      contact: formData.contact,
      resaddress: formData.address,
    };
    return await lit.encrypt(studentData, studentData.address);
  };
  return { encryptData };
}

export async function decryptData() {
  const encryptedData = {
    ciphertext:
      "l+iMsJqBoevB8jJ2dpk2uX5YT9LxaYCvvEulzOLblGmTj7SkyuPRdKTg54+eOwNZ/e85/mmrbKOLpLFpeZ/hinb5+aln3UoHZXhZ+AxPvaZ4m7KP74S028iXGUFJ4hHnmdKURioGEboJ2EPV0EjdKKSAQXCsbFAYEAXRlJaJf7+49lKsc9vf38/nyhCCXiPMkJfxTCJEnsDMA6yKgJQ4n1U3r8KeZri7A+f4Gpw3l+oCMIndzylqG9W3zrSuAu7Oae95nBmMErdwAg==",
    dataToEncryptHash:
      "7a8b45c2501618b55263f2952f2e68ad726c22b3ce5cc6549beb20123adddf97",
    accessControlConditions: [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "sepolia",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: "0xf1dd037c04c2973b10203259821B02e204ccaaA9",
        },
      },
    ],
  };
  const lit = new Lit();
  await lit.connect();
  return await lit.decrypt(encryptedData);
}
