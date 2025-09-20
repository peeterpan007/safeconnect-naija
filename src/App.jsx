import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// Pages
import Home from "./components/Home";
import IncidentReports from "./components/IncidentReports";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";
import NewsUpdate from "./components/NewsUpdate";
import IncidentMap from "./components/IncidentMap";

// Logos
import logo from "./assets/Connect4.jpg";
import IncidentLogo from "./assets/IncidentReporting.png";
import AdsLogo from "./assets/Ads.png";
import CommunityLogo from "./assets/Community.png";
import EventLogo from "./assets/Event.png";
import NewsLogo from "./assets/NewsUpdate.png";

import "./App.css";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

// Bottom Navigation Component
function BottomNav() {
  const location = useLocation();
  const navItems = [
    { path: "/", icon: logo, label: "Home" },
    { path: "/incidents", icon: IncidentLogo, label: "Incidents" },
    { path: "/ads", icon: AdsLogo, label: "Ads" },
    { path: "/community", icon: CommunityLogo, label: "Community" },
    { path: "/events", icon: EventLogo, label: "Events" },
    { path: "/news", icon: NewsLogo, label: "News" },
    { path: "/map", icon: IncidentLogo, label: "Map" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
        >
          <img src={item.icon} alt={item.label} className="nav-icon" />
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incidents" element={<IncidentReports user={user} />} />
          <Route path="/ads" element={<Ads user={user} />} />
          <Route path="/community" element={<CommunityConnect user={user} />} />
          <Route path="/events" element={<LocalEventsAndBusiness user={user} />} />
          <Route path="/news" element={<NewsUpdate user={user} />} />
          <Route path="/map" element={<IncidentMap />} />
        </Routes>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
