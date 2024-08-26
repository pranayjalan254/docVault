import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>DocVault</h2>
      <ul>
        <li>
          <NavLink to="/stud-dashboard/certificates" activeClassName="active">
            Certificates
          </NavLink>
        </li>
        <li>
          <NavLink to="/stud-dashboard/profile" activeClassName="active">
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
