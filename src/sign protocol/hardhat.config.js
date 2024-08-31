const { getUsedIdentifiers } = require("typechain");
require("@openzeppelin/hardhat-upgrades")
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("hardhat-deploy");
require("@typechain/hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
require("@oasisprotocol/sapphire-hardhat");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: ["7c6dcc5c7d55f6b35be37f7b9b6094c684156a34f9fe18dc1e1a6f7837d572a4"],
      chainId: 11155111,
      blockConfirmations: 1,
    },
    sapphire: {
      url: "https://sapphire-devnet.oasis.dev",
      accounts: ["7c6dcc5c7d55f6b35be37f7b9b6094c684156a34f9fe18dc1e1a6f7837d572a4"],
      chainId: 23295,
      blockConfirmations: 1,
    },
  },
  gasReporter:{
    enabled : true,
    currency : "usd",
  },
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.24" },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0, // Here this will by default take the first account as deployer
    },
  },
};
