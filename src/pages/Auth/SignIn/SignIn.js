import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

const SignIn = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer kullanıcı daha önce giriş yaptıysa direkt ana sayfaya yönlendir
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate("/");
    }
  }, [navigate]);

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

      const { status, message, data } = response.data;

      if (status === "success" && data) {
        console.log("User Data:", data);

        // Kullanıcı oturum bilgisini kaydet
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data));
        
        navigate("/"); // Ana sayfaya yönlendir
      } else {
        setError(message || "Login failed. Please try again.");
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
