import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Web3AuthProvider } from "/src/components/web3auth/Web3AuthProvider";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
