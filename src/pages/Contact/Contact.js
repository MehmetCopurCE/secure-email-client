import React from "react";
import "./Contact.css";
import { FaLinkedin, FaGithub, FaMedium } from "react-icons/fa"; // İkonları import ediyoruz
import profileImage from '../../assets/1D3A8469.jpg'; // Profil fotoğrafını import et

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-overlay"></div> {/* Karartma için overlay ekledik */}
      <div className="contact-content">

        <div className="contact-header">
          <img
            src={profileImage} // Fotoğrafı import ederek kullanıyoruz
            alt="Profile"
            className="profile-img"
          />
          <h1>Contact Information</h1>
          <p>If you would like to reach out, here are my contact details:</p>
        </div>

        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/mehmet-copur/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <FaLinkedin className="social-icon" />
            <p>LinkedIn</p>
          </a>
          <a
            href="https://github.com/MehmetCopurCE"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <FaGithub className="social-icon" />
            <p>GitHub</p>
          </a>
          <a
            href="https://medium.com/@mhmtcpr120"
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
          >
            <FaMedium className="social-icon" />
            <p>Medium</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
