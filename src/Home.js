import React, { useState,useEffect } from 'react';
import DeployNftContract from './components/DeployNftContract';
import MintNft from './components/InteractNftContract';
import './App.css';
import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import DeployFractionalNft from './components/DeployFractionalNFT';
import FractionalInteract from './components/interactFractionalContract';
import NftStats from './components/NftPage';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [contractAddress, setContractAddress] = useState('');
    const [fractionAddress, setFractionAddress] = useState('');
    const [wallet, setWallet] = useState('');
   
    //load saved Data
    useEffect( async ()=> {
      const savedContractAddress = localStorage.getItem('IpfsHash');
      const savedFractionAddress = localStorage.getItem('FractionIpfsHash');
      if(!savedContractAddress || !savedFractionAddress) return;

      const nftUrl = `https://gateway.pinata.cloud/ipfs/${savedContractAddress}`;
      const fractionUrl = `https://gateway.pinata.cloud/ipfs/${savedFractionAddress}`

      try{
        const nftResponse = await axios.get(nftUrl);
        const nftData = nftResponse.data;

        const fractionResponse = await axios.get(fractionUrl);
        const fractionData = fractionResponse.data;

        setContractAddress(nftData.contractAddress)
        setFractionAddress(fractionData.contractAddress);
      }catch(error){
        console.log('Error loading data',error);
      }
    }, []);


    const connect = async() => {
        try {
            if (!window.ethereum) {
              alert("MetaMask is not installed!");
              return;
            }
      
            await window.ethereum.request({ method: 'eth_requestAccounts' });
      
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWallet(address)
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="App">
            <div className='app_nav'>
              <div className='app_title'>
                <h1>Angle</h1>
              </div>
                <div className='app_link'>
                  {
                    wallet ?  <p>Wallet: {`${truncateEthAddress(wallet)}`}</p> : <button onClick={connect}>Connect Wallet</button>
                  }  
                </div>
            </div>
            <div className='app_content'>
                <div className='app_content_left'>
                    <h3>Unlock the potential of your digital assets with<br/> our innovative platform. Create fractional NFTs,<br/> allowing you to share ownership of unique <br/>digital items with others. Easily list your <br/>fractionalized NFTs for sale and engage in a new<br/> era of collaborative ownership. Join us in <br/>revolutionizing the NFT marketplace today!</h3>
                </div>
            </div>
            <div className='app_contract'>
            <DeployNftContract setContractAddress={setContractAddress} />
            
            {contractAddress &&
            <>
            <MintNft contractAddress={contractAddress} />
            <Link href={`/mynfts/${contractAddress}`}>My Nfts</Link>
            </>
            }

            </div>
            <div className='token_contract'>
              <DeployFractionalNft setFractionAddress={setFractionAddress}/>
              {fractionAddress && <FractionalInteract fractionAddress={fractionAddress}/>}
            </div>
        </div>
    );
}

export default Home
