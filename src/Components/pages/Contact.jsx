import React, { useState, useEffect } from "react";
import profile from "../Assets/profile.png";
import setting from "../Assets/setting.png";
import logout from "../Assets/logout.png";
import trash from "../Assets/delete.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = ({ userEmail, onLogout, role }) => {
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8081/employee/${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    if (userEmail) {
      fetchEmployee();
    }
  }, [userEmail]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/deleteEmp/${userEmail}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      toast.success("Account deleted successfully!");
       setTimeout(() => {
         navigate("/login");
       }, 4000); 
    
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleProfile = () => {
    navigate("/profile", { state: { data: employee } });
  };

  const handleAccount = () => {
    navigate("/edit", { state: { data: employee.email } });
  };

  const handleLogout = () => {
    
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      onLogout(); 
       navigate("/login"); 
    }
  };

  return (
    <div>
      <div className="menu-container">
        <div
          className="menu-trigger"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <img src={profile} alt="profile" />
        </div>
        <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
          <h3>
            {employee.name} <br /> <span>{role}</span>
          </h3>
          <ul>
            <DropdownItem
              img={profile}
              text="My Profile"
              onClick={handleProfile}
            />
            <DropdownItem
              img={setting}
              text="Account Settings"
              onClick={handleAccount}
            />
            <DropdownItem
              img={trash}
              text="Delete Account"
              onClick={handleDelete}
            />
            <DropdownItem img={logout} text="Logout" onClick={handleLogout} />
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

function DropdownItem(props) {
  return (
    <li className="dropdownItem" onClick={props.onClick}>
      <img src={props.img} alt="icon" />
      <a>{props.text}</a>
    </li>
  );
}

export default Contact;
