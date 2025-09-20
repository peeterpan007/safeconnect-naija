import React, { useState } from "react";
import Home from "./components/Home";
import IncidentReports from "./components/IncidentReports";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import LocalEventsBusiness from "./components/LocalEventsBusiness";
import NewsUpdate from "./components/NewsUpdate";
import IncidentMap from "./components/IncidentMap";

// Logos
import logo from "./assets/Connect4.jpg";
import IncidentLogo from "./assets/IncidentReporting.png";
import AdsLogo from "./assets/Ads.png";
import CommunityLogo from "./assets/Community.png";
import EventLogo from "./assets/Event.png";
import NewsLogo from "./assets/NewsUpdate.png";
import MapLogo from "./assets/IncidentReporting.png"; // Reuse Incident Logo for map

import "./App.css";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderTab = () => {
    switch (activeTab) {
      case "incidents":
        return <IncidentReports user={user} />;
      case "ads":
        return <Ads user={user} />;
      case "community":
        return <CommunityConnect user={user} />;
      case "events":
        return <LocalEventsBusiness user={user} />;
      case "news":
        return <NewsUpdate user={user} />;
      case "map":
        return (
          <div style={{ height: "500px", width: "100%" }}>
            <IncidentMap />
          </div>
        );
      default:
        return <Home />;
    }
  };

  const navItems = [
    { key: "home", icon: logo, label: "Home" },
    { key: "incidents", icon: IncidentLogo, label: "Incidents" },
    { key: "ads", icon: AdsLogo, label: "Ads" },
    { key: "community", icon: CommunityLogo, label: "Community" },
    { key: "events", icon: EventLogo, label: "Events" },
    { key: "news", icon: NewsLogo, label: "News" },
    { key: "map", icon: MapLogo, label: "Map" },
  ];

  return (
    <div className="app-container">
      {/* Main Content */}
      <div style={{ paddingBottom: "80px" }}>{renderTab()}</div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`nav-item ${activeTab === item.key ? "active" : ""}`}
          >
            <img src={item.icon} alt={item.label} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
