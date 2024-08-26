import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-insti">
      <div className="navbar-brand-insti">
        <h1>DocVault</h1>
      </div>
      <ul className="navbar-links-insti">
        <li>
          <NavLink to="/insti-dashboard/issue">Issue Certificate</NavLink>
        </li>

        <li>
          <NavLink to="/insti-dashboard/profile">Manage Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
