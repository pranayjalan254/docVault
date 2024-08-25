import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import { web3auth } from "../../web3auth/Web3modal";

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
    <div className="sidebar">
      <h2>DocVault</h2>
      <h2>Student Dashboard</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard/issue" activeClassName="active">
              Issue Certificate
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/certificates" activeClassName="active">
              View Certificates
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" activeClassName="active">
              Manage Profile
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;