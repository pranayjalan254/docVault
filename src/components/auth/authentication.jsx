import React, { useState, useContext } from "react";
import "./authentication.css";
import { Web3AuthContext } from "../web3auth/Web3AuthProvider";

const AuthPage = () => {
  const [userType, setUserType] = useState("institution");
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(Web3AuthContext); // Use Web3Auth context to get the login function

  const toggleUserType = (type) => {
    setUserType(type);
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(); // Call the Web3Auth login function
      // Handle successful login (e.g., redirect or show a message)
    } catch (error) {
      console.error("Login failed", error);
      // Handle login error
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <div className="user-type-toggle">
          <button
            className={userType === "institution" ? "active" : ""}
            onClick={() => toggleUserType("institution")}
          >
            Institution
          </button>
          <button
            className={userType === "person" ? "active" : ""}
            onClick={() => toggleUserType("person")}
          >
            Credential Holder
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {userType === "institution" && (
            <>
              <input type="text" placeholder="Institution Name" />
              <input type="email" placeholder="Institution Email" />
            </>
          )}
          {userType === "person" && (
            <>
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email" />
            </>
          )}
          <input type="password" placeholder="Password" />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleFormType}>{isLogin ? "Sign Up" : "Login"}</span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
