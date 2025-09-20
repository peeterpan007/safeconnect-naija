import React, { useState } from "react";
import IncidentReports from "./IncidentReports";
import Ads from "./Ads";
import CommunityConnect from "./CommunityConnect";
import LocalEventsBusiness from "./LocalEventsBusiness";
import NewsUpdate from "./NewsUpdate";
import IncidentMap from "./IncidentMap";

import logo from "../assets/Connect4.jpg";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  const renderTab = () => {
    switch (activeTab) {
      case "incidents":
        return <IncidentReports user={{ id: "1" }} />;
      case "ads":
        return <Ads user={{ id: "1" }} />;
      case "community":
        return <CommunityConnect user={{ id: "1" }} />;
      case "events":
        return <LocalEventsBusiness user={{ id: "1" }} />;
      case "news":
        return <NewsUpdate user={{ id: "1" }} />;
      case "map":
        return (
          <div style={{ height: "500px", width: "100%" }}>
            <IncidentMap />
          </div>
        );
      default:
        return (
          <div style={{ textAlign: "center" }}>
            <img src={logo} alt="SafeConnectNaija" style={{ height: "120px", marginBottom: "10px" }} />
            <h1>Welcome to SafeConnect Naija</h1>
            <p>Building safer, stronger communities across Nigeria</p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto", padding: "10px", gap: "10px", backgroundColor: "#311effff" }}>
        {["home", "incidents", "ads", "community", "events", "news", "map"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px",
              backgroundColor: activeTab === tab ? "#10b981" : "#fff",
              color: activeTab === tab ? "#fff" : "#000",
              border: "none",
              borderRadius: "5px",
              minWidth: "80px",
              cursor: "pointer",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "10px" }}>{renderTab()}</div>

      {/* Footer */}
      <div style={{ textAlign: "center", backgroundColor: "#0821c6", color: "#fff", padding: "40px 20px", marginTop: "20px", borderRadius: "10px" }}>
        <h2>Ready to make your neighborhood safer?</h2>
        <p>Join thousands of Nigerians already using SafeConnect to build stronger, safer communities.</p>
        <button style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "12px 25px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
          Join Your Community
        </button>
      </div>
    </div>
  );
}
