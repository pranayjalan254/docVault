import "./App.css";
import LandingPage from "./components/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3modal from "./components/web3auth/Web3modal";
import Dashboard from "./components/insti_dashboard/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Web3modal />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
