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
    <div className="sidebar-stud">
      <h3>Student Dashboard</h3>
      <nav>
        <ul>
          <li>
            <NavLink to="/stud-dashboard/certificates">
              View Certificates
            </NavLink>
          </li>
          <li>
            <NavLink to="/stud-dashboard/profile">Manage Profile</NavLink>
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
