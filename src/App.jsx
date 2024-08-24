import "./App.css";
import LandingPage from "./components/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3modal from "./components/web3auth/web3modal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Web3modal />} />
      </Routes>
    </Router>
  );
}

export default App;
