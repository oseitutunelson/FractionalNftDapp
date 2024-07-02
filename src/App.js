import React, { useState } from 'react';
import DeployNftContract from './DeployNftContract';
import InteractNftContract from './InteractNftContract';

function App() {
    const [contractAddress, setContractAddress] = useState('');

    return (
        <div className="App">
            <h1>NFT DApp</h1>
            <DeployNftContract setContractAddress={setContractAddress} />
            {contractAddress && <InteractNftContract contractAddress={contractAddress} />}
        </div>
    );
}

export default App;
