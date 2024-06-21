import "./App.css";
import { useState, useEffect } from "react";
import UploadNFTForm from "./pages/UploadNFTForm";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/navbar";
import { contractAddress, contractAbi } from "./constant";
import { ethers } from "ethers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadBcData();
    setupAccountChangeHandler();
  }, []);

  async function loadBcData() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      setContract(contractInstance);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const address = await signer.getAddress();
        console.log("Metamask Connected to " + address);
        setAccount(address);
        setIsConnected(true);
      } catch (err) {
        console.log(err);
      }
    }
  }

  function handleAccountChange(newAccounts) {
    if (newAccounts.length > 0) {
      const address = newAccounts[0];
      console.log("Metamask Connected to " + address);
      setAccount(address);
      setIsConnected(true);
    } else {
      console.log("Metamask Disconnected");
      setAccount(null);
      setIsConnected(false);
    }
  }

  function setupAccountChangeHandler() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }
  }

  return (
    <div className="App">
      <Navbar connectWallet={connectWallet} account={account} />

      <Routes>
        <Route
          path="/"
          element={
            <Marketplace
              contract={contract}
              isConnected={isConnected}
              account={account}
            />
          }
        />

        <Route
          path="/UploadNFTForm"
          element={<UploadNFTForm contract={contract} />}
        />
      </Routes>
    </div>
  );
}

export default App;
