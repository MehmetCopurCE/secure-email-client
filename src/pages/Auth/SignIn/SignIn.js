import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import edildi
import axios from "axios";
import "./SignIn.css";

const SignIn = () => {
  const [identifier, setIdentifier] = useState(""); // Kullanıcı adı veya email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // useNavigate ile yönlendirme işlemi yapacağız


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Username or email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:80/api/auth/login", {
        identifier,
        password,
      });

      if (response.data.status === "success") {
        console.log("User Data:", response.data.data);
        alert("Login successful!");
        navigate("/");

      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }

    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred while logging in."
      );
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="signin-form">
        <div className="input-group">
          <label htmlFor="identifier">Username or Email:</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your username or email"
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
        <button type="submit" className="signin-button" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
