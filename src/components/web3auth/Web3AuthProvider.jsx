import React, { createContext, useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/single-factor-auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { useNavigate } from "react-router-dom";

export const Web3AuthContext = createContext();

export const Web3AuthProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId:
            "BJgb0ddQVkAUythfMS7ZcbcvS-drqBdNZRIuk7d4YEzYLjUm2WFKVlFgF3BNO-zhILHAA2LaF0bDhL8rUfuQJ2k", // Replace with your Web3Auth Client ID
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1", // Ethereum Mainnet; use '0x5' for Goerli
            rpcTarget: "https://rpc.ankr.com/eth", // Replace with your RPC URL if needed
          },
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);

        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          const userInfo = await web3authInstance.getUserInfo();
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Web3Auth Initialization Error", error);
      } finally {
        setLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    const userInfo = await web3auth.getUserInfo();
    setUser(userInfo);

    navigate("/");
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setUser(null);
    navigate("/auth");
  };

  return (
    <Web3AuthContext.Provider
      value={{ web3auth, provider, user, login, logout, loading }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Please use 0x1 for Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};
