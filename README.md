#DocVault-Web3 Credential Verification Platform
This project is a decentralized credential verification platform built using Web3 technologies. It allows institutions to issue, verify, and encrypt academic and employment certificates using blockchain protocols. The project integrates Tableland for metadata storage, Lit Protocol for encryption, and Web3Auth for wallet management.

Features:
-Issue and store certificates (degrees, job offers, etc.) securely on the blockchain.
-Encrypt certificates so only the intended recipient can decrypt and view them.
-Use Tableland to store and manage certificate metadata.
-Wallet integration with Web3Auth for secure login and authentication.
-Frontend built with React for a smooth user experience.

Requirements:
Node.js (v18 or higher)
NPM or Yarn
MetaMask
Web3Auth account (for testing with wallet authentication)
Lit Protocol SDK
Tableland SDK
Sepolia testnet for smart contracts

Installation:
Follow these steps to set up the project locally:

Clone the repository:
git clone [https://github.com/pranayjalan254/docVault](https://github.com/pranayjalan254/docVault.git)

cd docVault

Install dependencies:
npm install
This will install all the required packages, including React, Web3Auth, Tableland SDK, Lit Protocol, and ethers.js.

Configure environment variables:
Create a .env file in the root directory with the following variables:

VITE_CLIENT_ID // Get it from web3auth


//Get it from the firebase config
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID

//Tableland config
VITE_WALLET_ADDRESS
VITE_WALLET_PRIVATE_KEY
VITE_RPC_URL

Running the Project:
npm run dev

Connect Wallet:
Make sure your Web3Auth wallet has enough test sepolia ETH connected to the Sepolia testnet.

//To decrypt certificates
On the issue credential page, navigate to the profile section where you will find the Web3Auth generated wallet address and your private key. Open your MetaMask wallet, click on the dropdown next to your account name, then select “Add Account” followed by “Import Wallet”. Copy the private key provided in the Web3Auth tab and paste it into MetaMask, then click “Enter” to add your account.
Next, follow the provided link to set up the Chronicle Yellowstone network. https://developer.litprotocol.com/connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone This involves configuring the network settings in MetaMask. Copy the wallet address from the link and paste it into the appropriate field in MetaMask to verify it. Once verified, the Datil test net token will be automatically added to your account.
After that, go to litexplorer.com. Click on “Connect Account” and select the imported account from the list. You will then need to choose the number of capacity credits you want per 1000 seconds and specify the duration for which you need these credits. Finally, click on “Buy Capacity Credits” to complete the process.

