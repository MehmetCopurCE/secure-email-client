import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import edildi
import axios from "axios"; // Axios'u kullanarak API isteği yapıyoruz
import "./Register.css";
import { generateRSAKeys, storePrivateKey } from "../../../utils/cryptoUtils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate ile yönlendirme işlemi yapacağız

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basit doğrulama (email, kullanıcı adı, şifre ve şifre onayı kontrolü)
    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { publicKeyPEM, privateKeyPEM } = await generateRSAKeys();
      console.log("Public Key (PEM):\n", publicKeyPEM);
      console.log("Private Key (PEM):\n", privateKeyPEM);

      const response = await axios.post("http://localhost:80/api/auth/register", {
        email,
        username,
        password,
        publicKey: publicKeyPEM,
      });

      if (response.data.status === "success") {
        await storePrivateKey(email, privateKeyPEM);
        navigate("/signin");
      } else {
        setError(response.data.errors || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      <p className="signin-link">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
