import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Information</h1>
      <p>If you would like to reach out, here are my contact details:</p>
      
      <div className="social-links">
        <a 
          href="https://www.linkedin.com/in/mehmet-copur/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-link"
        >
          LinkedIn
        </a>
        <a 
          href="https://github.com/MehmetCopurCE" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-link"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Contact;
