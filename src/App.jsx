import React from "react";
import IncidentReports from "./components/IncidentReports";
import IncidentMap from "./components/IncidentMap";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdate from "./components/NewsUpdates";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";
import logo from "./assets/SafeConnect.png"; // Import your logo
import "./App.css";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  return (
    <div>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#1e90ff",
          padding: "30px 20px",
          color: "#fff",
          borderRadius: 10,
          marginBottom: 30,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
            SafeConnect Naija
          </h1>
          <a href="/" style={{ display: "inline-block" }}>
            <img
              src={logo}
              alt="SafeConnect Logo"
              style={{ height: "70px", borderRadius: "6px", cursor: "pointer" }}
            />
          </a>
        </div>
        <p style={{ marginTop: 10, fontSize: 18, color: "#e0f0ff" }}>
          Building safer, stronger communities across Nigeria
        </p>
      </header>

      {/* Main Content */}
      <div className="main-content" style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 2 }}>
          <IncidentReports user={user} />
          <LocalEventsAndBusiness user={user} />
          <IncidentMap />
        </div>

        <div style={{ flex: 1 }}>
          <Ads user={user} />
          <CommunityConnect user={user} />
          <NewsUpdate user={user} />
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <h2>Ready to make your neighborhood safer?</h2>
        <p>
          Join thousands of Nigerians already using SafeConnect to build
          stronger, safer communities.
        </p>
        <button>Join Your Community</button>
      </div>
    </div>
  );
}

export default App;
