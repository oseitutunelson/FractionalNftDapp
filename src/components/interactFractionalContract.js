import React, { useState } from 'react';
import { ethers } from 'ethers';
import nftArtifact from '../contracts/Nft.sol/FractionalNft.json';

const FractionalInteract = ({fractionAddress}) =>{
    const [tokenId,setTokenId] = useState('');
    const [price,setPrice] = useState('');
    const [tokenAmount,setTokenAmount] = useState('');
    const [nftAddress,setNftAddress] = useState('')

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

    return(
        <div className='fraction'>
         <div className='fraction_interact'>
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
        </div>
    )
}

export default FractionalInteract;