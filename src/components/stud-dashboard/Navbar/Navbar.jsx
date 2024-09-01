import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar-stud">
      <h2>DocVault</h2>
      <ul>
        <li>
          <NavLink to="/stud-dashboard/certificates">Certificates</NavLink>
        </li>
        <li>
          <NavLink to="/stud-dashboard/walletaddress">Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
