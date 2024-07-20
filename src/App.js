import { Routes, Route } from "react-router-dom"
import Home from "./Home"
import NftStats from "./components/NftPage";
import NoPage from "./components/NoPage";
import React, {useState} from "react";
import DeployContract from "./components/DeployNftContract";
import './App.css';


function App() {
    const [contractAddress,setContractAddress] = useState('')
    
  return (
    <div className="App">
     
      
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path={`/mynfts/${contractAddress}`} element={
           <NftStats contractAddress={contractAddress}/> 
           } />
        <Route path="*" element={ <NoPage/> } />
      </Routes>
    </div>
  )
}

export default App