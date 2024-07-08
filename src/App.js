import { Routes, Route } from "react-router-dom"
import Home from "./Home"
import NftPage from "./components/NftPage";
import NoPage from "./components/NoPage";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="myNfts" element={ <NftPage/> } />
        <Route path="*" element={ <NoPage/> } />
      </Routes>
    </div>
  )
}

export default App