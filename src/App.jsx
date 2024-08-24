import "./App.css";
import LandingPage from "./components/landingPage";
import AuthPage from "./components/auth/authentication";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Web3AuthProvider } from "./components/web3auth/Web3AuthProvider";

function App() {
  return (
    <Router>
      <Web3AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Web3AuthProvider>
    </Router>
  );
}

export default App;
