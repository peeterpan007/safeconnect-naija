import React from "react";
import IncidentReports from "./components/IncidentReports";
import IncidentMap from "./components/IncidentMap";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdate from "./components/NewsUpdates";
import LocalEventsAndBusiness from "./components/LocalEventsBusiness";
import "./App.css";

const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  return (
    <div>
      {/* Header */}
      <header style={{ textAlign: "center", backgroundColor: "#1e90ff", padding: 30, color: "#fff", borderRadius: 10, marginBottom: 30 }}>
        <h1>SafeConnect Naija</h1>
        <p>Building safer, stronger communities across Nigeria</p>
      </header>

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
    </div>
  );
}

export default App;
