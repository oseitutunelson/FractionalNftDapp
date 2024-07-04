import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';

const MintNft = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [uri, setUri] = useState('');

  const mintNft = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(contractAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.mint(await signer.getAddress(), tokenId, uri);
      await tx.wait();
      alert(`NFT minted with token ID: ${tokenId}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT");
    }
  };

  return (
    <div>
      <h2>Mint Your NFT</h2>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token URI"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <button onClick={mintNft}>Mint NFT</button>
    </div>
  );
};

export default MintNft;
