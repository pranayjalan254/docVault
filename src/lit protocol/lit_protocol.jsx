import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ethers } from "../ethers-5.6.esm.min.js";
import {
  LitAccessControlConditionResource,
  LitAbility,
  createSiweMessageWithRecaps,
} from "@lit-protocol/auth-helpers";
import { LitNetwork } from "@lit-protocol/constants";
import { useFormData } from "../components/insti_dashboard/IssueCertificateForm/FormData.jsx";
import {web3auth} from "../components/web3auth/Web3modal"

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
      const web3authProvider = await web3auth.connect();
      // Extract provider and signer from Web3Auth
      this.provider = new ethers.providers.Web3Provider(web3authProvider);
      this.signer = this.provider.getSigner();
      this.currentAccount = await this.signer.getAddress();
      console.log("Connected to Web3Auth. Current account:", this.currentAccount);
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

  async encrypt(studentData, walletAddress) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain : 'sepolia',
        method: '',
        parameters: [
          ':userAddress',
        ],
        returnValueTest: {
          comparator: '=',
          value: walletAddress
        }
      }
    ]
    try {
      console.log("Encrypting data...");

      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          chain: this.chain,
          dataToEncrypt: JSON.stringify(studentData),
        },
        litNodeClient
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
    "ciphertext": "rl14mnavxhALV9Y4egxJsIjRNM9ObY1qBm8dcfukyolot7vgrJgZBjJfL9fyhi3/FpvlORuC5uDT9ftpw8jsHKuW79o63rtw1HWjcs8Z2BJqzDYH4rQs+L9ZsmlB0Y1YkFaHCxZr8LUQGssMxZpK5uW8ldH2nYEIg1QIXj/TJi8fp39N8WNK+x7fPVbg6LktyRJGpCgHzLETsu/pY+agHnjd5U2ohkt/pBcFS9OzO1Hrtb3y1S8auofz8wI=",
    "dataToEncryptHash": "4bcc536fc2437d6417a59a195ddbfed3ba04596a63357e3513bf4f2440e7e86b",
    "accessControlConditions": [
      {
        "contractAddress": "",
        "standardContractType": "",
        "chain": "sepolia",
        "method": "",
        "parameters": [
          ":userAddress"
        ],
        "returnValueTest": {
          "comparator": "=",
          "value": "0x92a83F98AD680792995060793F2F79ae0E7b786b"
        }
      }
    ]
  }
  const lit = new Lit();
  await lit.connect();
  return await lit.decrypt(encryptedData);
}
