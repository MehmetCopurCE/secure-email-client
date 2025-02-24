import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Home.css";
import { FaShieldAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa"; // Import Arrow Icon

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcı giriş durumu kontrolü
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(storedUser);
    }
  }, []);

  const handleGetStartedClick = () => {
    if (isLoggedIn) {
      // Eğer kullanıcı giriş yapmışsa Chat sayfasına yönlendir
      navigate("/chat");
    } else {
      // Eğer kullanıcı giriş yapmamışsa SignIn sayfasına yönlendir
      navigate("/signin");
    }
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>Secure Email System</h1>
        <p>Protect your emails with end-to-end encryption.</p>
        <div className="home-features">
          <div className="home-feature-card">
            <FaShieldAlt className="home-feature-icon" />
            <h3>Secure</h3>
            <p>Military-grade encryption for all messages.</p>
          </div>
          <div className="home-feature-card">
            <FaLock className="home-feature-icon" />
            <h3>Private</h3>
            <p>Your emails are visible only to you and the recipient.</p>
          </div>
          <div className="home-feature-card">
            <FaEnvelope className="home-feature-icon" />
            <h3>Reliable</h3>
            <p>Fast and seamless email delivery worldwide.</p>
          </div>
        </div>
        <button className="home-start-button" onClick={handleGetStartedClick}>
          Get Started <FaArrowRight className="home-arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default Home;
