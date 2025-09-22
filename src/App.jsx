import React, { useState } from "react";
import {
  FaHome,
  FaMapMarkerAlt,
  FaClipboardList,
  FaBullhorn,
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
} from "react-icons/fa";

import IncidentReports from "./components/IncidentReports";
import IncidentMap from "./components/IncidentMap";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdate from "./components/NewsUpdate";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";

import logo from "./assets/Connect4.jpg";
import "./App.css";

import Login from "./components/Login";
import SignUp from "./components/SignUp";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [authTab, setAuthTab] = useState("login");

  const renderHomePage = () => (
    <div className="home-container">
      <img src={logo} alt="SafeConnect Logo" className="home-logo" />
      <p className="home-description">
        Building safer, stronger communities across Nigeria
      </p>

      {/* Auth Tabs */}
      <div className="auth-tabs">
        <button
          onClick={() => setAuthTab("login")}
          className={authTab === "login" ? "tab-button active-tab" : "tab-button"}
        >
          Login
        </button>
        <button
          onClick={() => setAuthTab("signup")}
          className={authTab === "signup" ? "tab-button active-tab" : "tab-button"}
        >
          Sign Up
        </button>
      </div>

      {/* Auth Form with fade animation */}
      <div className="auth-form-container" key={authTab}>
        {authTab === "login" ? <Login /> : <SignUp />}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderHomePage();
      case "incidents":
        return <IncidentReports user={user} />;
      case "map":
        return (
          <div className="map-container">
            <IncidentMap />
          </div>
        );
      case "ads":
        return <Ads user={user} />;
      case "community":
        return <CommunityConnect user={user} />;
      case "events":
        return (
          <div className="events-container">
            <LocalEventsAndBusiness user={user} />
          </div>
        );
      case "news":
        return <NewsUpdate user={user} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <h1>SafeConnect Naija</h1>
      </header>

      {/* Main Content */}
      <div className="main-content">{renderTabContent()}</div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => setActiveTab("home")} className="nav-btn">
          <FaHome size={24} />
        </button>
        <button onClick={() => setActiveTab("incidents")} className="nav-btn">
          <FaClipboardList size={24} />
        </button>
        <button onClick={() => setActiveTab("map")} className="nav-btn">
          <FaMapMarkerAlt size={24} />
        </button>
        <button onClick={() => setActiveTab("ads")} className="nav-btn">
          <FaBullhorn size={24} />
        </button>
        <button onClick={() => setActiveTab("community")} className="nav-btn">
          <FaUsers size={24} />
        </button>
        <button onClick={() => setActiveTab("events")} className="nav-btn">
          <FaCalendarAlt size={24} />
        </button>
        <button onClick={() => setActiveTab("news")} className="nav-btn">
          <FaNewspaper size={24} />
        </button>
      </nav>
    </div>
  );
}

export default App;