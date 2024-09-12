import React  ,{useState} from  'react';
import nftArtifact from '../contracts/fractionalNft.sol/FractionalNft.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function DeployFractionalNft({setFractionAddress}){
    const [contractAddress,setContractAddress] = useState('');

    //save contract Address to pinata
    const saveToPinata = async (contractAddress) => {
      const data = {
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
    
          console.log('Preparing contract factory with ABI and bytecode');
          const Token = new ethers.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, signer);
    
          console.log('Deploying contract with parameters:',await signer.getAddress());
          const token = await Token.deploy(await signer.getAddress());
    
          console.log('Waiting for contract deployment to be mined...');
          await token.waitForDeployment();

          const contractAddress = await token.getAddress();
    
          console.log('Contract deployed successfully:', token);
          localStorage.setItem('fractionContract',contractAddress)
          // const addressFraction = localStorage.getItem('fractionContract');
          // console.log(addressFraction);
         setContractAddress(contractAddress);
         setFractionAddress(contractAddress);
          alert(`Contract deployed at: ${await token.getAddress()}`);
          const ipfsHash = await saveToPinata(contractAddress);
          if (ipfsHash) {
            console.log(`Contract data saved with IPFS hash: ${ipfsHash}`);
          }
          localStorage.setItem('FractionIpfsHash',ipfsHash);
        } catch (error) {
          console.error("Error deploying contract:", error);
          alert(`Error deploying contract: ${error.message}`);
        }
      };

      //load contract address from pinata
      //load contract data from pinata
  const loadFromPinata = async () => {
    const ipfsHash = localStorage.getItem('FractionIpfsHash');
    if (!ipfsHash) return;

    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    try {
      const response = await axios.get(url);
      const contractData = response.data;

      setContractAddress(contractData.contractAddress);
      setFractionAddress(contractData.contractAddress);

      console.log('Contract data loaded from Pinata:', contractData);
    } catch (error) {
      console.error('Error loading contract data from Pinata:', error);
      alert('Error loading contract data from Pinata');
    }
  };

      return(
        <div className='token'>
            <h2>Deploy Fractional Nft Contract</h2>
            <p>This is a fractional nft contract that your nft's are transferred into and divided into shares.</p>
            <button onClick={deployContract}>Deploy Contract</button>
            {contractAddress && <div>
              <p>Deployed to : {contractAddress}</p>
              
            </div>
            }
        </div>
      )
}