import React, { useEffect, useState } from "react";
import user_icon from "./Assets/person.png";
import email_icon from "./Assets/email.png";
import password_icon from "./Assets/password.png";
import "./LoginSignUp/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("INTERVIEWER");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);
      stompClient.subscribe("/topic/admin", (message) => {
        console.log("Received message:", message.body);
      });
    });

    stompClient.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
    };

    stompClient.onWebSocketClose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const handleSignup = async () => {
    if (name.length < 4 || !/^[A-Z]/.test(name)) {
      setErrorMessage(
        "Name must start with a capital letter and be at least 4 characters long."
      );
      return;
    }


    const allowedDomains = ["accenture.com"];
    const emailDomain = email.split("@")[1];

    if (!allowedDomains.includes(emailDomain)) {
      setErrorMessage(
        "The email domain is not allowed. Please use a valid domain."
      );
      return;
    }

   
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setErrorMessage(
        "Password must contain at least one uppercase letter and one special character."
      );
      return;
    }

   
    

    setErrorMessage(""); 
    const payload = {
      name: name,
      email: email,
      password: password,
      role: role,
    };

    try {
      console.log("Sending payload:", payload);
      const response = await fetch("http://localhost:8081/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Signup successful");
        navigate("/login");
      } else {
        console.error("Signup error:", responseData);
        setErrorMessage("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="con">
      <div className="header">
        <div className="text">
          Accenture Internal Resource Allocation Portal
        </div>

        <div className="underline"></div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="User Icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="input">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="INTERVIEWER">Interviewer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="submit-container">
          <div className="submit" onClick={handleSignup}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
}
