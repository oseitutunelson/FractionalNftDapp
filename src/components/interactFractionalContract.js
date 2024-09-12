import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/fractionalNft.sol/FractionalNft.json';
import axios from 'axios';

const FractionalInteract = ({ fractionAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [shares, setShares] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  //const [tokenData, setTokenData] = useState({ tokenAddress: '', tokenID: '', tokenShares: '', tokenPrice: '' });

  //upload tokenData
  const uploadToIPFS = async (tokenData) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    try {
      const response = await axios.post(url, tokenData, {
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

  // Validate NFT before purchase using nftCollections function
  const validateNft = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return false;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const nftData = await nftContract.nftCollections(nftAddress, tokenId);
      if (nftData) {
        return true; // NFT is valid
      }
    } catch (error) {
      console.error('Invalid NFT address or tokenId:', error);
      return false;
    }

    return false;

  }

  // Initialize NFT collection (fractionalize the NFT)
  const initializeNft = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.initialize(nftAddress, tokenId, shares);
      await tx.wait();
      alert('NFT contract initialized successfully.');
    } catch (error) {
      console.error('Error initializing contract:', error);
      alert('Error initializing contract.');
    }
  };

  // Put NFT for sale
  const putNftForSale = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.putForSale(nftAddress, tokenId, ethers.parseEther(price));
      await tx.wait();
      alert('NFT is now for sale.');

      // After successful transaction, upload data to Pinata
      const nftData = {
        nftAddress: nftAddress,
        tokenId: tokenId,
        salePrice: price,
        timestamp: new Date().toISOString(),
      };

      // Upload the NFT data to Pinata
      await uploadToIPFS(nftData);
    } catch (error) {
      console.error('Error putting NFT for sale:', error);
      alert('Error putting NFT for sale.');
    }
  };

  // Purchase full NFT (accepting nftAddress and tokenId)
  const purchaseNft = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.purchase(nftAddress, tokenId, { value: ethers.parseEther(buyAmount) });
      await tx.wait();
      alert('NFT purchased successfully.');
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Error purchasing NFT.');
    }
  };

  // Purchase shares of the NFT (accepting nftAddress and tokenId)
  const purchaseShares = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const sharePrice = (price * buyAmount) / shares;
      const tx = await nftContract.purchaseShare(nftAddress, tokenId, buyAmount, { value: ethers.parseEther(sharePrice) });
      await tx.wait();
      alert('NFT shares purchased successfully.');
    } catch (error) {
      console.error('Error purchasing NFT shares:', error);
      alert('Error purchasing NFT shares.');
    }
  };

  // Redeem the NFT
  const redeemNft = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.redeem(nftAddress, tokenId, buyAmount);
      await tx.wait();
      alert('NFT redeemed successfully.');
    } catch (error) {
      console.error('Error redeeming NFT:', error);
      alert('Error redeeming NFT.');
    }
  };

  // Display NFT sale price
  const displayNftSalePrice = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

    try {
      const tx = await nftContract.nftCollections(nftAddress, tokenId);
      setPrice(ethers.formatEther(tx.salePrice));
      alert(`NFT Sale Price: ${price} ETH`);
    } catch (error) {
      console.error('Error displaying NFT sale price:', error);
      alert('Error displaying NFT sale price.');
    }
  };

  return (
    <div className="fraction">
      <div className="fraction_interact">
        <div className="interact">
          <h3>Initialize NFT Contract</h3>
          <p>Fractionalize your NFT</p>
          <input type="text" placeholder="NFT Collection Address" onChange={(e) => setNftAddress( e.target.value )} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <input type="text" placeholder="Shares Amount" onChange={(e) => setShares(e.target.value)} />
          <button onClick={initializeNft}>Initialize</button>
        </div>

        <div className="putForSale">
          <h3>Put NFT For Sale</h3>
          <input type="text" placeholder="NFT Address" onChange={(e) => setNftAddress(e.target.value)} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <input type="text" placeholder="Sale Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <button onClick={putNftForSale}>Put For Sale</button>
        </div>

        <div className="purchase">
          <h3>Purchase Full NFT</h3>
          <input type="text" placeholder="NFT Address" onChange={(e) => setNftAddress(e.target.value)} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <input type="text" placeholder="Buy Amount (ETH)" onChange={(e) => setBuyAmount(e.target.value)} />
          <button onClick={purchaseNft}>Purchase NFT</button>
        </div>

        <div className="purchaseShares">
          <h3>Purchase NFT Shares</h3>
          <input type="text" placeholder="NFT Address" onChange={(e) => setNftAddress(e.target.value)} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <input type="text" placeholder="Shares Amount" onChange={(e) => setBuyAmount(e.target.value)} />
          <button onClick={purchaseShares}>Purchase Shares</button>
        </div>

        <div className="redeemNft">
          <h3>Redeem NFT</h3>
          <input type="text" placeholder="NFT Address" onChange={(e) => setNftAddress(e.target.value)} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <button onClick={redeemNft}>Redeem NFT</button>
        </div>

        <div>
          <h3>Display NFT Sale Price</h3>
          <input type="text" placeholder="NFT Address" onChange={(e) => setNftAddress(e.target.value)} />
          <input type="text" placeholder="Token Id" onChange={(e) => setTokenId(e.target.value)} />
          <button onClick={displayNftSalePrice}>Display Sale Price</button>
        </div>
      </div>
    </div>
  );
};

export default FractionalInteract;
