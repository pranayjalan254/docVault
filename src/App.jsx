import "./App.css";
import LandingPage from "./components/landingPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3modal from "./components/web3auth/Web3modal";
import Insti_dashboard from "./components/insti_dashboard/dashboard/Dashboard";
import Stud_dashboard from "./components/stud-dashboard/dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./AuthContext";
import { FormDataProvider } from "./components/insti_dashboard/IssueCertificateForm/FormData";



function App() {
  return (
    <FormDataProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Web3modal />} />
            <Route path="/*" element={<ProtectedRoute />}>
              <Route path="insti-dashboard/*" element={<Insti_dashboard />} />
              <Route path="stud-dashboard/*" element={<Stud_dashboard />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </FormDataProvider>
  );
}

export default App;
