require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-toolbox');
require('hardhat-deploy');


PRIVATE_KEY = '681f8d7f47808db4623ecd36e8a14f947c1aa278cd217e61b3faff50c50e2215'
Private_key = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
module.exports = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/rGNd6GSILO4p5ekkYo7JteZBV5TZ0MB1`,
            accounts: [`0x${PRIVATE_KEY}`]
        },
       anvil:{
        url: "http://127.0.0.1:8545",
        accounts: [`0x${Private_key}`]
       }
    }
};
