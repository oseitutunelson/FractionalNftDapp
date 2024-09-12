import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';
import '../styles/deploy.css';
import axios from 'axios';

const DeployContract = ({setContractAddress}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [contractAddress,setContractAddress1] = useState('');

   // Function to save contract data to Pinata
   const saveToPinata = async (contractAddress) => {
    const data = {
      name,
      symbol,
      contractAddress,
    };

    const jsonData = JSON.stringify(data);

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    try {
      const response = await axios.post(
        url,
        data,
        {
          headers: {
            pinata_api_key: "4a0e0d15e482e61e9279",
            pinata_secret_api_key: '3ced20157371fd8135da08d2e89c0bb19e8f3e1901c71e63622cde478f464caa',
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      console.log(`Data saved to Pinata with hash: ${ipfsHash}`);
      return ipfsHash;
    } catch (error) {
      console.error('Error saving to Pinata:', error);
      alert('Error saving contract data to Pinata');
    }
  };

  const deployContract = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log('Preparing contract factory with ABI and bytecode');
      const Nft = new ethers.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, signer);

      console.log('Deploying contract with parameters:', name, symbol, await signer.getAddress());
      const nft = await Nft.deploy(name, symbol, await signer.getAddress());

      console.log('Waiting for contract deployment to be mined...');
      await nft.waitForDeployment();

      const contractAddress = await nft.getAddress();

      console.log('Contract deployed successfully:', nft);
      localStorage.setItem('nftContractAddress', contractAddress);
      setContractAddress(contractAddress);
      setContractAddress1(contractAddress);
      alert(`Contract deployed at: ${await nft.getAddress()}`);
      
      const ipfsHash = await saveToPinata(contractAddress);
      if (ipfsHash) {
        console.log(`Contract data saved with IPFS hash: ${ipfsHash}`);
      }
      localStorage.setItem('IpfsHash',ipfsHash);
    } catch (error) {
      console.error("Error deploying contract:", error);
      alert(`Error deploying contract: ${error.message}`);
    }

    
    
  };

  //load contract data from pinata
  const loadFromPinata = async () => {
    const ipfsHash = localStorage.getItem('IpfsHash');
    if (!ipfsHash) return;

    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    try {
      const response = await axios.get(url);
      const contractData = response.data;

      setName(contractData.name);
      setSymbol(contractData.symbol);
      setContractAddress1(contractData.contractAddress);
      setContractAddress(contractData.contractAddress);

      console.log('Contract data loaded from Pinata:', contractData);
    } catch (error) {
      console.error('Error loading contract data from Pinata:', error);
      alert('Error loading contract data from Pinata');
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
