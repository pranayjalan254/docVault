import "./App.css";
import LandingPage from "./components/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3modal from "./components/web3auth/Web3modal";
import Insti_dashboard from "./components/insti_dashboard/dashboard/Dashboard";
import Stud_dashboard from "./components/stud-dashboard/dashboard/Dashboard";
import ProtectedRoute from "../src/ProtectedRoute";
import { AuthProvider } from "../src/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Web3modal />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/insti-dashboard/*"
                    element={<Insti_dashboard />}
                  />
                  <Route
                    path="/stud-dashboard/*"
                    element={<Stud_dashboard />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
