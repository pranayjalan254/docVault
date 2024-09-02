import { useEffect, useState } from "react";
import { web3auth } from "../../web3auth/Web3modal";
import { ethers } from "../../../ethers-5.6.esm.min.js";
import "./wallet.css";

const GetWalletAddress = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const web3authProvider = await web3auth.connect();
        const userInfo = await web3auth.getUserInfo();
        setName(userInfo.name || "Name not available");
        setEmail(userInfo.email || "Email not available");

        const ethersProvider = new ethers.providers.Web3Provider(
          web3authProvider
        );
        const signer = ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();
        const walletBalance = await ethersProvider.getBalance(walletAddress);

        setAddress(walletAddress);
        setBalance(ethers.utils.formatEther(walletBalance));
      } catch (err) {
        setError("Failed to connect and fetch wallet details.");
        console.error("Error fetching wallet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, []);

  if (loading) {
    return <h2 className="loading">Loading wallet details...</h2>;
  }

  if (error) {
    return <h2 className="error">{error}</h2>;
  }

  return (
    <div className="card-container">
      <div className="card-content">
        <div className="card-details">
          <h2>Name: {name}</h2>
          <h2>Email: {email}</h2>
          <h2>Wallet Address: {address}</h2>
          <h2>Balance: {balance} Sepolia ETH</h2>
        </div>
      </div>
    </div>
  );
};

export default GetWalletAddress;
