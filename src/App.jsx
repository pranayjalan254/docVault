import "./App.css";
import LandingPage from "./components/landingPage";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Web3AuthProvider } from "./components/web3auth/Web3AuthProvider";
import Web3authInit from "./components/web3auth/Web3auth";

function App() {
  return (
    <Router>
      <Web3AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Web3authInit />} />
        </Routes>
      </Web3AuthProvider>
    </Router>
  );
}

export default App;
