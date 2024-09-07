import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { useNavigate } from "react-router-dom";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { useAuth } from "../../AuthContext";
import { ethers } from "../../ethers-5.6.esm.min.js";
import "./web3auth.css";

const clientId = import.meta.env.VITE_CLIENT_ID ?? "";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget:
    "https://eth-sepolia.g.alchemy.com/v2/fNr3TwzXGZWEmV13p3mCxDAhHYj1fgKP",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorer: "https://sepolia.etherscan.io/",
  ticker: "ETH",
  tickerName: "Sepolia Ether",
};

export const datilConfig = {
  chainNamespace: "eip155",
  chainId: "0x2AC54",
  rpcTarget: "https://yellowstone-rpc.litprotocol.com/",
  displayName: "Chronicle Yellowstone",
  blockExplorer: "https://yellowstone-explorer.litprotocol.com/",
  ticker: "tstLPX",
  tickerName: "Datil",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const metamaskAdapter = new MetamaskAdapter({
  clientId,
  sessionTime: 86400,
  web3AuthNetwork: "sapphire_devnet",
  chainConfig: chainConfig,
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

function Web3modal() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        // Configure the Metamask adapter
        web3auth.configureAdapter(metamaskAdapter);
        // Initialize Web3Auth modal
        await web3auth.initModal();
        // Set the provider if already connected
        setProvider(web3auth.provider);
        // Check if already connected and navigate based on user role
        if (web3auth.connected) {
          const role = await getUserRole();
          if (role) {
            login();
            setUserType(role);
            navigate(
              role === "institution" ? "/insti-dashboard" : "/stud-dashboard"
            );
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, [navigate, login]);

  const handleLogin = async () => {
    try {
      // Connect using Web3Auth modal
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider
      );
      const signer = ethersProvider.getSigner();

      const address = await signer.getAddress();
      console.log("Wallet Address:", address);

      const balance = await ethersProvider.getBalance(address);
      console.log("Wallet Balance:", ethers.utils.formatEther(balance));

      // Navigate based on the user role after successful login
      if (web3auth.connected) {
        const role = await getUserRole();
        if (role) {
          login();
          setUserType(role);
          navigate(
            role === "institution" ? "/insti-dashboard" : "/stud-dashboard"
          );
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const getUserRole = async () => {
    return userType;
  };

  return (
    <div className="container">
      <div className="grid">
        {isAuthenticated ? (
          <div className="flex-container">
            <div></div>
            <div>
              <h1>Please refresh</h1>
            </div>
          </div>
        ) : (
          <div className="login-card">
            <h2 className="login-title">Login</h2>
            <div className="user-toggle">
              <button
                className={userType === "institution" ? "active" : ""}
                onClick={() => setUserType("institution")}
              >
                Institution
              </button>
              <button
                className={userType === "student" ? "active" : ""}
                onClick={() => setUserType("student")}
              >
                Credential Holder
              </button>
            </div>

            <button onClick={handleLogin} className="login-button">
              Login with Web3Auth
            </button>
            <button className="back" onClick={() => navigate("/")}>
              Go to website
            </button>
          </div>
        )}
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </div>
  );
}

export default Web3modal;
