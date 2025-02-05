import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/secureEmailLogo.png"; // Logo ekliyoruz
import userIcon from "../../assets/user.png"; // Kullanıcı ikonu
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown menüsünün durumu
  const [user, setUser] = useState(null); // Kullanıcı bilgilerini saklayacağız
  const dropdownRef = useRef(null); // Dropdown'un dışına tıklamayı kontrol için ref

  useEffect(() => {
    // localStorage'dan giriş durumunu kontrol et ve güncelle
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    // Kullanıcı bilgilerini localStorage'dan al
    if (loggedIn) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }

    // Sayfa değiştiğinde dropdown'u kapat
    setIsDropdownOpen(false);
  }, [location]); // `location` değiştiğinde çalışır (sayfa değiştiğinde veya yenilenince kapanır)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Dışına tıklanınca kapat
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/"); // Çıkış sonrası giriş sayfasına yönlendir
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Dropdown tıklanınca kapanmamasını sağla
    setIsDropdownOpen((prevState) => !prevState);
  };

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
        {!isLoggedIn ? (
          <Link
            to="/signin"
            className={location.pathname === "/signin" ? "btn signin active-link" : "btn signin"}
          >
            Sign In
          </Link>
        ) : (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-icon" onClick={toggleDropdown}>
              <img src={userIcon} alt="User" className="user-icon-img" />
              {user?.username} {/* Kullanıcı adını göster */}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="btn logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
