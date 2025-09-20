import React, { useState } from "react";
import { FaHome, FaMapMarkerAlt, FaClipboardList, FaBullhorn, FaUsers, FaCalendarAlt, FaNewspaper } from "react-icons/fa";

import IncidentReports from "./components/IncidentReports";
import IncidentMap from "./components/IncidentMap";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdate from "./components/NewsUpdate";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";

import logo from "./assets/Connect4.jpg";
import "./App.css";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [authTab, setAuthTab] = useState("login"); // "login" or "signup"

  const renderHomePage = () => (
    <div style={{ padding: 20, textAlign: "center" }}>
      {/* Enlarged Home Logo */}
      <img
        src={logo}
        alt="SafeConnect Logo"
        style={{ height: 250, borderRadius: 22, marginBottom: 30 }}
      />
      <p style={{ fontSize: "1.1rem", marginBottom: 20 }}>
        Building safer, stronger communities across Nigeria
      </p>

      {/* Auth Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 15, marginBottom: 25 }}>
        <button
          onClick={() => setAuthTab("login")}
          className={authTab === "login" ? "active-tab" : ""}
        >
          Login
        </button>
        <button
          onClick={() => setAuthTab("signup")}
          className={authTab === "signup" ? "active-tab" : ""}
        >
          Sign Up
        </button>
      </div>

      {/* Forms */}
      <div>
        {authTab === "login" ? (
          <form className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
          </form>
        )}
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
          <div style={{ height: "calc(100vh - 80px - 60px)" }}>
            <IncidentMap />
          </div>
        );
      case "ads":
        return <Ads user={user} />;
      case "community":
        return <CommunityConnect user={user} />;
      case "events":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 15, padding: "10px 0" }}>
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
      {/* Header with only title */}
      <header
        style={{
          backgroundColor: "#311eff",
          padding: "20px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>SafeConnect Naija</h1>
      </header>

      {/* Main Content */}
      <div className="main-content" style={{ padding: "0 10px 80px" }}>
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#311eff",
          color: "#fff",
          padding: "10px 0",
          zIndex: 100,
        }}
      >
        <button onClick={() => setActiveTab("home")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaHome size={24} />
        </button>
        <button onClick={() => setActiveTab("incidents")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaClipboardList size={24} />
        </button>
        <button onClick={() => setActiveTab("map")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaMapMarkerAlt size={24} />
        </button>
        <button onClick={() => setActiveTab("ads")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaBullhorn size={24} />
        </button>
        <button onClick={() => setActiveTab("community")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaUsers size={24} />
        </button>
        <button onClick={() => setActiveTab("events")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaCalendarAlt size={24} />
        </button>
        <button onClick={() => setActiveTab("news")} style={{ background: "none", border: "none", color: "#fff" }}>
          <FaNewspaper size={24} />
        </button>
      </nav>
    </div>
  );
}

export default App;
