import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';
import '../styles/deploy.css';

const DeployContract = ({setContractAddress}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [contractAddress,setContractAddress1] = useState('');

  const deployContract = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log('Preparing contract factory with ABI and bytecode');
      const Nft = new ethers.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, signer);

      console.log('Deploying contract with parameters:', name, symbol, await signer.getAddress());
      const nft = await Nft.deploy(name, symbol, await signer.getAddress());

      console.log('Waiting for contract deployment to be mined...');
      await nft.waitForDeployment();

      console.log('Contract deployed successfully:', nft);
      setContractAddress(`${await nft.getAddress()}`);
      setContractAddress1(`${await nft.getAddress()}`)
      alert(`Contract deployed at: ${await nft.getAddress()}`);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert(`Error deploying contract: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Deploy Your NFT Contract</h2>
      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="NFT Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={deployContract}>Deploy Contract</button>
     {contractAddress &&<p>Contract Address: {contractAddress}</p>}
    </div>
  );
};

export default DeployContract;
