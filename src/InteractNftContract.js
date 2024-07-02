import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractData from './contractData/contractData.json';

function InteractNftContract({ contractAddress }) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenId, setTokenId] = useState('');
    const [tokenURI, setTokenURI] = useState('');

    useEffect(() => {
        if (window.ethereum) {
            const _provider = new ethers.BrowserProvider(window.ethereum); // Updated import
            setProvider(_provider);

            const _signer = _provider.getSigner();
            setSigner(_signer);

            if (contractAddress) {
                const _contract = new ethers.Contract(contractAddress, contractData.abi, _signer);
                setContract(_contract);
            }
        }
    }, [contractAddress]);

    const mintNft = async () => {
        if (contract && tokenId && tokenURI) {
            const tx = await contract.mint(signer.getAddress(), tokenId, tokenURI);
            await tx.wait();
            alert('NFT Minted Successfully!');
        }
    };

    return (
        <div>
            <h1>Interact with NFT Contract</h1>
            <input
                type="text"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
            />
            <input
                type="text"
                placeholder="Token URI"
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
            />
            <button onClick={mintNft}>Mint NFT</button>
        </div>
    );
}

export default InteractNftContract;
