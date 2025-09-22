import React, { useState, useEffect } from "react";
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
import SCLogo2 from "./assets/SCLogo2.png";
import startupSoundFile from "./assets/startup.mp3";
import "./App.css";

import Login from "./components/Login";
import SignUp from "./components/SignUp";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

// Splash component
function Splash({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const audio = new Audio(startupSoundFile);
    audio.volume = 1;

    // Play sound immediately
    audio.play().catch(() => {
      // Web fallback for autoplay restrictions
      const handleInteraction = () => {
        audio.play().catch((err) => console.log("Playback failed:", err));
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
      };
      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
    });

    // Wait until metadata loads to get duration
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration * 1000; // ms

      // Fade out a little before the sound ends
      const fadeTime = 100; // fade 100ms before end
      const fadeTimer = setTimeout(() => setFadeOut(true), duration - fadeTime);
      const finishTimer = setTimeout(onFinish, duration);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    });
  }, [onFinish]);

  return (
    <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
      <img src={SCLogo2} alt="Loading Logo" className="loading-logo" />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [authTab, setAuthTab] = useState("login");
  const [loading, setLoading] = useState(true);

  const renderHomePage = () => (
    <div className="home-container">
      <img src={logo} alt="SafeConnect Logo" className="home-logo" />
      <p className="home-description">
        Building safer, stronger communities across Nigeria
      </p>

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

  if (loading) {
    return <Splash onFinish={() => setLoading(false)} />;
  }

  return (
    <div>
      <header className="app-header">
        <h1>SafeConnect Naija</h1>
      </header>

      <div className="main-content">{renderTabContent()}</div>

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
