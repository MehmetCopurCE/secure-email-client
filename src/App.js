import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn/SignIn";
import Register from "./pages/Auth/Register/Register";
import ChatPage from "./pages/Chat/ChatPage"; // Chat bileşeni


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} /> 

      </Routes>
    </Router>
  );
};

export default App;
