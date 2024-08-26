import React  ,{useState} from  'react';
import nftArtifact from '../contracts/fractionalNft.sol/FractionalNft.json';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';

export default function DeployFractionalNft({setFractionAddress}){
    const [contractAddress,setContractAddress] = useState('');
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
    
          console.log('Contract deployed successfully:', token);
          localStorage.setItem('fractionContract',await token.getAddress())
         setContractAddress(`${await token.getAddress()}`);
         setFractionAddress(`${await token.getAddress()}`)
          alert(`Contract deployed at: ${await token.getAddress()}`);
        } catch (error) {
          console.error("Error deploying contract:", error);
          alert(`Error deploying contract: ${error.message}`);
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