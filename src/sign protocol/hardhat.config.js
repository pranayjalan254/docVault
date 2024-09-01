const { getUsedIdentifiers } = require("typechain");
require("@openzeppelin/hardhat-upgrades");
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
      accounts: ["process.env.VITE_PRIVATE_KEY"],
      chainId: 11155111,
      blockConfirmations: 1,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "usd",
  },
  solidity: {
    compilers: [{ version: "0.8.0" }, { version: "0.8.24" }],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
