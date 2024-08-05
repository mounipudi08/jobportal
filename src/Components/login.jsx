import React, { useState, useContext } from "react";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";
import "./LoginSignUp/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";

export default function Login() {
  const { handleLogin } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include",
      });

      console.log("Response status:", response.status); 

      if (!response.ok) {
        const responseData = await response.json(); 
        setError("Access Denied");
        throw new Error("Login failed: " + responseData.message);
      }

      const token = await response.text(); 
      if (!token) {
        throw new Error("Token not found in response");
      }
      console.log("Token:", token);
      localStorage.setItem("token", token);

      
      const role = fetchRoleFromToken(token);
      console.log("Role fetched:", role);

      handleLogin(email, role); 
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error.message); 
    }
  };

  
  const fetchRoleFromToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.role;
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="con">
      <div className="header">
        <div className="text">
          Accenture Internal Resource Allocation Portal
        </div>
        <div className="underline"></div>
        <div className="inputs">
          {error && <div className="error-message">{error}</div>}
          <div className="input">
            <img src={email_icon} alt="Email Icon" />
            <input
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="Password Icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="forgot-password">
          Forgot Password?<span> Click here!</span>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleLoginSubmit}>
            Login
          </div>
        </div>
        <div className="forgot-password">
          New user?{" "}
          <span className="signup-link" onClick={handleSignupRedirect}>
            Sign up here
          </span>
        </div>
      </div>
    </div>
  );
}