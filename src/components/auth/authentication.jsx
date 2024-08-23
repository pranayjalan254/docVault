import React, { useState } from "react";
import "./authentication.css";

const AuthPage = () => {
  const [userType, setUserType] = useState("institution");
  const [isLogin, setIsLogin] = useState(true);

  const toggleUserType = (type) => {
    setUserType(type);
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
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

        <form className="auth-form">
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
