import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';

const FetchNfts = ({ contractAddress }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
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
      // Assuming you have a way to get the total number of tokens owned by the user
      const balance = await nftContract.balanceOf(userAddress);

      const userNfts = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
        const tokenURI = await nftContract.tokenURI(tokenId);
        userNfts.push({ tokenId: tokenId.toString(), tokenURI });
      }

      setNfts(userNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      alert(`Error fetching NFTs: ${error.message}`);
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
              <p>Token URI: {nft.tokenURI}</p>
              {/* Assuming the tokenURI is a link to an image */}
              <img src={nft.tokenURI} alt={`NFT ${nft.tokenId}`} width="200" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchNfts;
