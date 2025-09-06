// src/App.jsx
import React from "react";
import IncidentReports from "./components/IncidentReports";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdate from "./components/NewsUpdates";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";
import "./App.css";

// Example user
const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  return (
    <div id="root">
      {/* Header */}
      <header style={{
        textAlign: "center",
        backgroundColor: "#1e90ff",
        padding: "30px 20px",
        borderRadius: "10px",
        color: "#fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <img
          src="https://i.postimg.cc/hQ9rThmg/safeconnect-image.png"
          alt="SafeConnect Naija"
          className="logo"
        />
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>SafeConnect Naija</h1>
        <p style={{ marginTop: "10px", fontSize: "18px", fontWeight: "400", color: "#e0f0ff" }}>
          Building safer, stronger communities across Nigeria through technology and collaboration
        </p>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Column */}
        <div className="left-column">
          <div className="card">
            <IncidentReports user={user} />
          </div>
          <div className="card">
            <LocalEventsAndBusiness user={user} />
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="card">
            <Ads user={user} />
          </div>
          <div className="card">
            <CommunityConnect user={user} />
          </div>
          <div className="card">
            <NewsUpdate user={user} />
          </div>
        </div>
      </div>

      {/* Footer / Call-to-Action */}
      <div className="footer">
        <h2>Ready to make your neighborhood safer?</h2>
        <p>Join thousands of Nigerians already using SafeConnect to build stronger, safer communities.</p>
        <button>Join Your Community</button>
      </div>
    </div>
  );
}

export default App;
