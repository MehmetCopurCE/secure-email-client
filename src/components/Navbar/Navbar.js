import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/secureEmailLogo.png"; // Logo ekliyoruz
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Mevcut sayfanın yolunu al

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Secure Email Logo" className="logo-img" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={location.pathname === "/" ? "active-link" : ""}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className={location.pathname === "/about" ? "active-link" : ""}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className={location.pathname === "/contact" ? "active-link" : ""}
          >
            Contact
          </Link>
        </li>
      </ul>
      <div className="auth-buttons">
        <Link 
          to="/signin" 
          className={location.pathname === "/signin" ? "btn signin active-link" : "btn signin"}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
