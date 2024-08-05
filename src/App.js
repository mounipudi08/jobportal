import React, { useState, useEffect } from "react";
import {
  Link,
  Navigate,
  useLocation,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Components/Navbar.css";
import SignUp from "./Components/SignUp";
import Login from "./Components/login";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Account from "./Components/Account";
import { AppContext } from "./Components/AppContext";
import Resumes from "./Components/pages/Resumes";
import Contact from "./Components/pages/Contact";
import Requests from "./Components/pages/Requests";
import Interviews from "./Components/pages/Interviews";
import TokenExpiryCheck from "./Components/TokenExpiryCheck";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (storedEmail && storedRole && token) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
      setUserRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setUserEmail("");
      setUserRole("");
    }
  }, []);

  const handleTokenExpired = () => {
    alert("Your session has expired. Please log in again.");
    handleLogout();
    navigate("/login");
  };

  const handleLogin = (email, role) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setUserRole("");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const pageClass =
    isLoginPage || isSignupPage
      ? isLoginPage
        ? "login-page"
        : "signup-page"
      : "";

  return (
    <AppContext.Provider
      value={{ isLoggedIn, handleLogin, handleLogout, userRole }}
    >
      {isLoggedIn && <TokenExpiryCheck onTokenExpired={handleTokenExpired} />}

      {isLoggedIn && userRole === "ADMIN" && !isLoginPage && <AdminNavbar />}
      {isLoggedIn && userRole === "INTERVIEWER" && !isLoginPage && (
        <InterviewerNavbar />
      )}
      <div className={pageClass}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/signup" element={<SignUp />} />
          {isLoggedIn && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit" element={<Account />} />
              <Route path="/resumes" element={<Resumes />} />
              <Route
                path="/interviews"
                element={<Interviews email={userEmail} />}
              />
              <Route path="/requests" element={<Requests />} />
              <Route
                path="/contact"
                element={
                  <Contact
                    userEmail={userEmail}
                    onLogout={handleLogout}
                    role={userRole}
                  />
                }
              />
            </>
          )}
        </Routes>
      </div>
      <ToastContainer />
    </AppContext.Provider>
  );
}

function AdminNavbar() {
  return (
    <nav className="bg-custom-purple p-4">
      <div className="cont mx-auto flex justify-between items-center">
        <Link to="/home" className="title">
          Accenture
        </Link>
        <div className="hidden md:flex items-center">
          <Link to="/resumes" className="nav-link">
            Resumes
          </Link>
          <Link to="/requests" className="nav-link">
            Requests
          </Link>
          <Link to="/contact" className="nav-link">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

function InterviewerNavbar() {
  return (
    <nav className="bg-custom-purple p-4">
      <div className="cont mx-auto flex justify-between items-center">
        <Link to="/home" className="title">
          Accenture
        </Link>
        <div className="hidden md:flex items-center">
          <Link to="/interviews" className="nav-link">
            Interviews
          </Link>
          <Link to="/contact" className="nav-link">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default App;

