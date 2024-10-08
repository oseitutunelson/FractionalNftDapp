const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory
  const Nft = await ethers.getContractFactory("Nft");

  // Define the parameters to pass to the constructor
  const name = "MyNft";
  const symbol = "NFT";
  const initialOwner = deployer.address;

  // Deploy the contract with the constructor parameters
  const nft = await Nft.deploy(name, symbol, initialOwner);

  // Wait for the contract to be deployed
  await nft.waitForDeployment();

  console.log("Nft deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
