import React, { useState } from "react";
import logo from "../assets/Connect4.jpg";
import "./Home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="home-container">
      {/* Logo & Header */}
      <div className="header">
        <img src={logo} alt="SafeConnect Naija" className="home-logo" />
        <h1 className="home-title">SafeConnect Naija</h1>
        <p className="home-subtitle">Connecting Communities, Staying Safe</p>
      </div>

      {/* Tabs for Login & Signup */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
          onClick={() => setActiveTab("signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Forms */}
      <div className="form-container">
        {activeTab === "login" && (
          <form className="form">
            <input type="text" placeholder="Username" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="submit" className="form-btn">Login</button>
          </form>
        )}

        {activeTab === "signup" && (
          <form className="form">
            <input type="text" placeholder="Full Name" className="form-input" />
            <input type="text" placeholder="Username" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <input type="password" placeholder="Password" className="form-input" />
            <button type="submit" className="form-btn">Sign Up</button>
          </form>
        )}
      </div>

      {/* Footer CTA */}
      <footer className="home-footer">
        <p>Join your community and stay updated with SafeConnect Naija.</p>
      </footer>
    </div>
  );
}

export default Home;
