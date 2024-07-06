const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const Token = await ethers.getContractFactory("FractionalNft");

  // Define the parameters to pass to the constructor
  const initialOwner = deployer.address;

  // Deploy the contract with the constructor parameters
  const token  = await Token.deploy(initialOwner);

  // Wait for the contract to be deployed
  await token.waitForDeployment();

  console.log("Token Contract deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
