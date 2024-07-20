import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/fractionalNft.sol/FractionalNft.json';

const FractionalInteract = ({fractionAddress}) =>{
    const [tokenId,setTokenId] = useState('');
    const [price,setPrice] = useState('');
    const [tokenAmount,setTokenAmount] = useState('');
    const [nftAddress,setNftAddress] = useState('');
    const [buyAmount,setBuyAmount] = useState('');

    //initialize nft collection
    const initializeNft = async () =>{
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
          }
      
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address =  await signer.getAddress();
          
          console.log('Connecting to contract at address:', fractionAddress);
          const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

          try{
            const tx = await nftContract.initialize(nftAddress,tokenId,tokenAmount);
            await tx.wait();
            console.log('Nft contract initialized');
            alert('Nft contract initialized');
          }catch(error){
            console.log("Error initializing contract",error);
            alert("Error initializing contract",error);
          }
    }

    //put nft for sale
    const putNftForSale = async () =>{
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
          }
      
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address =  await signer.getAddress();
          
          console.log('Connecting to contract at address:', fractionAddress);
          const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

          try{
            const tx = await nftContract.putForSale(nftAddress,tokenId,price);
            await tx.wait();
            setBuyAmount(price);
            console.log("Successfully put for sale")
          }catch(error){
            console.log("Nft put for sale Error",error);
            alert("Error in Put for sale",error);
          }
    }

    //purchase ful nft function
    const purchaseNft = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
          }
      
          await window.ethereum.request({ method: 'eth_requestAccounts' });
      
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address =  await signer.getAddress();
          
          console.log('Connecting to contract at address:', fractionAddress);
          const nftContract = new ethers.Contract(fractionAddress, nftArtifact.abi, signer);

          try{
             const priceInWei = ethers.parseEther(price);
            // setBuyAmount(priceInWei);
             const tx = await nftContract.purchase(nftAddress,tokenId,{value :ethers.parseEther(buyAmount)});
             await tx.wait();
             console.log("Successfully purchased nft");
          }catch(error){
            console.log("Error purchasing Nft",error);
            alert("Error purchasing nft",error);
          }
    }

    return(
        <div className='fraction'>
         <div className='fraction_interact'>
            <div className='interact'>
            <h3>Initialize Nft Contract</h3>
            <p>Allow your nfts to be fractionalized</p>
            <input type='text'
            placeholder='Nft Collection Address'
            onChange={(e) => setNftAddress(e.target.value)}/>
            <input type='text' 
            placeholder='Token Id'
             onChange={(e)=>setTokenId(e.target.value)}/>
             <input type='text'
             placeholder='Amount'
             onChange={(e)=>setTokenAmount(e.target.value)}/>
             <button onClick={initializeNft}>Initialize</button>
            </div>
            <div className='putForSale'>
                <h3>Put Nft For Sale</h3>
                <input type='text'
                placeholder='Nft Address'
                onChange={(e)=>setNftAddress(e.target.value)}/>
                <input type='text'
                placeholder='Token Id'
                onChange={(e) => setTokenId(e.target.value)}/>
                <input type='text'
                placeholder='Price'
                onChange={(e) => setPrice(e.target.value)}/>
                <button onClick={putNftForSale}>Put For Sale</button>
            </div>
            <div className='purchaseFull'>
              <h3>Purchase A Full Nft</h3>
              <p>Buy a complete nft, all the shares at once</p>
              <input type='text'
              placeholder='Nft Address'
              onChange={(e)=>setNftAddress(e.target.value)}/>
              <input type='text'
              placeholder='Token Id'
              onChange={(e) => setTokenId(e.target.value)}/>
              <input type='text'
              placeholder='Price'
              value={buyAmount}/>
              <button onClick={purchaseNft}>Buy</button>
            </div>
         </div>
        </div>
    )
}

export default FractionalInteract;