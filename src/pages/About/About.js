import React from "react";
import { FaLock, FaEnvelope, FaShieldAlt } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <div className="about-page-container">
      <div className="about-overlay"></div>
      <div className="about-content">
        <h1 className="about-title">About This Project</h1>
        <p className="about-description">
          A secure email platform ensuring privacy and encryption for your communications.
        </p>
        <div className="about-feature-cards">
          <div className="about-feature-card">
            <FaLock className="about-feature-icon" />
            <h3 className="about-feature-title">End-to-End Encryption (E2EE)</h3>
            <p className="about-feature-text">Your emails are fully encrypted, ensuring privacy from sender to receiver.</p>
          </div>
          <div className="about-feature-card">
            <FaEnvelope className="about-feature-icon" />
            <h3 className="about-feature-title">Secure Email Communication</h3>
            <p className="about-feature-text">Protects your messages from unauthorized access and cyber threats.</p>
          </div>
          <div className="about-feature-card">
            <FaShieldAlt className="about-feature-icon" />
            <h3 className="about-feature-title">Advanced Security</h3>
            <p className="about-feature-text">Two-factor authentication and spam filtering keep your inbox safe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
