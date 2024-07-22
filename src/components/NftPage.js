import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';
import axios from 'axios';

const NftStats = ({ contractAddress }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    const storedNfts = JSON.parse(localStorage.getItem('nfts')) || [];
    setNfts(storedNfts);


    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const nftContract = new ethers.Contract(contractAddress, nftArtifact.abi, provider);

    try {
      const balance = await nftContract.balanceOf(userAddress);
      console.log(balance);
      const userNfts = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
        const tokenURI = await nftContract.tokenURI(tokenId);

        // Fetch metadata from IPFS
        const response = await axios.get(tokenURI);
        console.log(response.data);
        const metadata = response.data;

        userNfts.push({ tokenId: tokenId.toString(), metadata });
      }

     setNfts(userNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert(`Error fetching NFTs: ${error.message}`)
    }
  };

  return (
    <div>
       <h2>Your NFTs</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found</p>
      ) : (
        <div>
          {nfts.map((nft) => (
            <div key={nft.tokenId}>
              <p>Token ID: {nft.tokenId}</p>
              <p>Name: {nft.metadata.name}</p>
              <p>Description: {nft.metadata.description}</p>
              <img src={`https://emerald-fancy-gerbil-824.mypinata.cloud/ipfs/${nft.metadata.image}`} alt={`NFT ${nft.tokenId}`} width="200" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NftStats;
