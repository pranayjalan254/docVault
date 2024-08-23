import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="DocVault Logo" />
        <h1>DocVault</h1>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#footer">Contact</a>
        </li>
      </ul>
      <button className="cta-button" onClick={() => navigate("/auth")}>
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;
