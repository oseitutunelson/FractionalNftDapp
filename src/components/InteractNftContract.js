import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';
//import FetchNfts from './NftPage';
import NftStats from './NftPage';
import axios from 'axios';

const MintNft = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [uri, setUri] = useState('');
  const [fractionalContract,setFractionalContract] = useState('');
  let isApprove = true;
  const [isApproved, setIsApproved] = useState(isApprove);
  const [metadata, setMetadata] = useState({ name: '', description: '', image: '' });
  const [error, setError] = useState('');

  //upload metadata
  const uploadToIPFS = async (metadata) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    try {
      const response = await axios.post(url, metadata, {
        headers: {
          pinata_api_key: '4a0e0d15e482e61e9279',
          pinata_secret_api_key: '3ced20157371fd8135da08d2e89c0bb19e8f3e1901c71e63622cde478f464caa',
        },
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error('IPFS upload failed');
    }
  };
  //mint nft
  const mintNft = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address =  await signer.getAddress();
    
    console.log('Connecting to contract at address:', contractAddress);
    const nftContract = new ethers.Contract(contractAddress, nftArtifact.abi, signer);

    try {
      const cid = await uploadToIPFS(metadata);
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${cid}`;
      console.log('Token URI:', tokenURI);
      const tx = await nftContract.mint(address, tokenId, tokenURI);
      await tx.wait();

      // Save the NFT data in local storage
      const storedNfts = JSON.parse(localStorage.getItem('nfts')) || [];
      storedNfts.push({ tokenId, tokenURI });
      localStorage.setItem('nfts', JSON.stringify(storedNfts));

      alert(`NFT minted! Token ID: ${tokenId}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setError(`Error minting NFT: ${error.message}`)
    }
  };

  //setApprove For fractional Nft contract
  const setApprove = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address =  await signer.getAddress();
    
    console.log('Connecting to contract at address:', contractAddress);
    const nftContract = new ethers.Contract(contractAddress, nftArtifact.abi, signer);

    try{
      const tx = await nftContract.setApprovalForAll(fractionalContract,isApproved);
      await tx.wait();
      alert('Approved contract');
    }catch(error){
      console.log('Error Approving Contract',error);
      alert('Error Approving Contract')
    }
  }

  return (
    <div>
      <h2>Interact with Nft</h2>
     <div className='nft_interact'>
      <div className='nft_mint'>
      <h2>Mint NFT</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        value={metadata.name}
        onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={metadata.description}
        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={metadata.image}
        onChange={(e) => setMetadata({ ...metadata, image: e.target.value })}
      />
      <button onClick={mintNft}>Mint</button>
     
      </div>
      <div className='nft_setApprove'>
        <h3>Set Approve For fractional nft Contract</h3>
        <input
        type="text"
        placeholder="Fractional Nft Contract"
        value={fractionalContract}
        onChange={(e) => setFractionalContract(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token ID"
        value={isApproved}
      />
      <button onClick={setApprove}>Set Approve</button>
      </div>
     </div>
    </div>
  );
};

export default MintNft;
