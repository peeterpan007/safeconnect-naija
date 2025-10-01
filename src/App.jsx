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
import PhoneLogin from "./components/PhoneLogin";

import { UserProvider, useUser } from "./components/UserContext";

// Splash component
function Splash({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const audio = new Audio(startupSoundFile);
    audio.volume = 1;

    audio.play().catch(() => {
      const handleInteraction = () => {
        audio.play().catch(() => {});
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
      };
      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
    });

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration * 1000;
      const flashTime = duration * 0.8;
      const fadeTime = 100;

      const flashTimer = setTimeout(() => setFlash(true), flashTime);
      const fadeTimer = setTimeout(() => setFadeOut(true), duration - fadeTime);
      const finishTimer = setTimeout(onFinish, duration);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(fadeTimer);
        clearTimeout(finishTimer);
      };
    });
  }, [onFinish]);

  return (
    <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
      <img
        src={SCLogo2}
        alt="Loading Logo"
        className={`loading-logo ${fadeOut ? "zoom-out" : ""}`}
      />
      {flash && <div className="flash-overlay" />}
    </div>
  );
}

// Main App Content
function AppContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [authTab, setAuthTab] = useState("login");
  const [loading, setLoading] = useState(true);

  const { user, guest, login, continueAsGuest } = useUser();

  const renderHomePage = () => (
    <div className={`home-container ${loading ? "fade-hidden" : "fade-in"}`}>
      <img src={logo} alt="SafeConnect Logo" className="home-logo" />
      <p className="home-description">
        Building safer, stronger communities across Nigeria
      </p>

      {!user && (
        <>
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
            <button
              onClick={() => setAuthTab("phone")}
              className={authTab === "phone" ? "tab-button active-tab" : "tab-button"}
            >
              Phone Login
            </button>
            <button onClick={continueAsGuest} className="tab-button">
              Continue as Guest
            </button>
          </div>

          <div className="auth-form-container" key={authTab}>
            {authTab === "login" && <Login onLogin={login} />}
            {authTab === "signup" && <SignUp onSignUp={login} />}
            {authTab === "phone" && <PhoneLogin onVerify={login} />}
          </div>
        </>
      )}

      {user && (
        <p className="welcome-msg">
          Welcome {guest ? "Guest" : user.name}! You can navigate through the app below.
        </p>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (guest) {
      switch (activeTab) {
        case "home":
        case "incidents":
          return activeTab === "home" ? renderHomePage() : <IncidentReports user={user} guest={guest} />;
        case "map":
        case "ads":
        case "community":
        case "events":
        case "news":
          return (
            <div className="view-only-message">
              Login or Sign Up to access this section.
            </div>
          );
        default:
          return null;
      }
    }

    // Full access for logged-in users
    switch (activeTab) {
      case "home":
        return renderHomePage();
      case "incidents":
        return <IncidentReports user={user} />;
      case "map":
        return <IncidentMap />;
      case "ads":
        return <Ads user={user} />;
      case "community":
        return <CommunityConnect user={user} />;
      case "events":
        return <LocalEventsAndBusiness user={user} />;
      case "news":
        return <NewsUpdate user={user} />;
      default:
        return null;
    }
  };

  if (loading) return <Splash onFinish={() => setLoading(false)} />;

  return (
    <div>
      <header className="app-header">
        <h1>SafeConnect Naija</h1>
      </header>

      <div className="main-content">{renderTabContent()}</div>

      {user && (
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
      )}
    </div>
  );
}

// Wrap App in UserProvider
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
