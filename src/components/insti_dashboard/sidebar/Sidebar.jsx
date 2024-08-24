import React from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>DocVault</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard/issue" active="active">
              Issue Certificate
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/certificates" active="active">
              View Certificates
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/profile" active="active">
              Manage Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
