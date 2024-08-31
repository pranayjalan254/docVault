const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhart-config");
const { providers } = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying EducationalCredential and waiting for confirmations...");
  
  const EducationalCredential = await deploy("EducationalCredential", {
    from: deployer,
    args: [process.env.Address],
    log: true,
  });

  log(`EducationalCredential deployed at ${EducationalCredential.address}`);
};

module.exports.tags = ["all", "fundme"];
