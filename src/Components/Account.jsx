import React, { useState } from "react";
import user_icon from "./Assets/person.png";
import password_icon from "./Assets/password.png";
import "./LoginSignUp/LoginSignup.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Account() {
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState({
    name: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  const validateForm = () => {
   
    if (post.name.length < 4 || !/^[A-Z]/.test(post.name)) {
      setErrorMessage(
        "Name must start with a capital letter and be at least 4 characters long."
      );
      return false;
    }

   
    if (
      !/[A-Z]/.test(post.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(post.password)
    ) {
      setErrorMessage(
        "Password must contain at least one uppercase letter and one special character."
      );
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return; 

    try {
      const response = await axios.put(
        `http://localhost:8081/update/${location.state.data}`,
        post,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Submitted successfully:", response.data);
      toast.success("Details updated successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update details. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="con">
        <div className="header">
          <div className="text">Update your Details</div>
          <div className="underline"></div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                onChange={handleChange}
                type="text"
                placeholder="Name"
                name="name"
                value={post.name}
                required
              />
            </div>

            <div className="input">
              <img src={password_icon} alt="" />
              <input
                onChange={handleChange}
                type="password"
                placeholder="Password"
                name="password"
                value={post.password}
                required
              />
            </div>
          </div>

          <div className="submit-container">
            <div className="submit">
              <input className="button" type="submit" value="Update" />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}

export default Account;
