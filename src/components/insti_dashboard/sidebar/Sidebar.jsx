import { NavLink, useNavigate } from "react-router-dom";
import { web3auth } from "../../web3auth/Web3modal";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await web3auth.logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar-insti">
      <h3>
        <NavLink to="/insti-dashboard">Institution Dashboard</NavLink>
      </h3>
      <nav>
        <ul>
          <li>
            <NavLink to="/insti-dashboard/walletaddress">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/insti-dashboard/issue">Issue Certificate</NavLink>
          </li>
          <li>
            <NavLink to="/insti-dashboard/profile">Manage Profile</NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button-insti">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
