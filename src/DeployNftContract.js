import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from './contractData/contractData.json';

const DeployContract = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const deployContract = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();

    const Nft = new ethers.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, signer);

    try {
      const nft = await Nft.deploy(name, symbol, await signer.getAddress());
      await nft.deployTransaction.wait();  // Ensure the transaction is mined
      setContractAddress(nft.address);
      alert(`Contract deployed at: ${nft.address}`);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert("Error deploying contract");
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
      {contractAddress && <p>Contract Address: {contractAddress}</p>}
    </div>
  );
};

export default DeployContract;
