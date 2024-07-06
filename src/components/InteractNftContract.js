import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/Nft.json';


const MintNft = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [uri, setUri] = useState('');
  const [fractionalContract,setFractionalContract] = useState('');
  let isApprove = true;
  const [isApproved, setIsApproved] = useState(isApprove);
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
      const tx = await nftContract.mint(address, tokenId, uri);
      await tx.wait();
      alert(`NFT minted with token ID: ${tokenId}`);
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT");
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
      alert('Error Approving Contract');
    }
  }

  return (
    <div>
      <h2>Interact with Nft</h2>
     <div className='nft_interact'>
      <div className='nft_mint'>
      <h3>Mint nft</h3>
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
      {mintNft ?  <p>Minted with token ID : {tokenId}</p> : null}
      </div>
      <div className='nft_setApprove'>
        <h3>Set Approve For fractional nft Contract</h3>
        <input
        type="text"
        placeholder="Token ID"
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
