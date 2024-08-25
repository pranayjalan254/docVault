import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { useNavigate } from "react-router-dom";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import "./web3auth.css";
import { useAuth } from "../../AuthContext";

const clientId =
  "BJgb0ddQVkAUythfMS7ZcbcvS-drqBdNZRIuk7d4YEzYLjUm2WFKVlFgF3BNO-zhILHAA2LaF0bDhL8rUfuQJ2k";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
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
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          login(); // Update the auth context
          // Retrieve user type from a stored state or backend
          const role = await getUserRole(); // Implement this function
          setUserType(role);
          navigate(
            role === "institution" ? "/dashboard" : "/student-dashboard"
          );
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
  }, [navigate, login]);

  const handleLogin = async () => {
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        login(); // Update the auth context
        const role = await getUserRole(); // Implement this function
        setUserType(role);
        navigate(role === "institution" ? "/dashboard" : "/student-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      logout(); // Update the auth context
      setUserType(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserRole = async () => {
    // Fetch user role from a backend service or local storage
    // Example: return await fetchUserRoleFromBackend();
    return "institution"; // Placeholder
  };

  return (
    <div className="container">
      <div className="grid">
        {isAuthenticated ? (
          <div className="flex-container">
            <div></div>
            <div>
              <button onClick={handleLogout} className="card">
                Log Out
              </button>
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
            <input
              type="text"
              placeholder={
                userType === "institution" ? "Institution Name" : "Student Name"
              }
              className="input-field"
            />
            <input
              type="email"
              placeholder={
                userType === "institution"
                  ? "Institution Email"
                  : "Student Email"
              }
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
            />
            <button onClick={handleLogin} className="login-button">
              Login
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
