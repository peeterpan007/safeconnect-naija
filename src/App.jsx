import React from "react";
import IncidentReports from "./components/IncidentReports";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import NewsUpdates from "./components/NewsUpdates"; // <-- matches actual file
import LocalEventsBusiness from "./components/LocalEventsBusiness"; // <-- matches actual file

// Example user
const user = { id: "1", area: "NY", interests: ["security", "home services"] };

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh", padding: "20px" }}>

      {/* Header Section */}
      <div style={{
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
          style={{ width: "150px", height: "auto", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", borderRadius: "8px" }}
        />
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>SafeConnect Naija</h1>
        <p style={{ marginTop: "10px", fontSize: "18px", fontWeight: "400", color: "#e0f0ff" }}>
          Building safer, stronger communities across Nigeria through technology and collaboration
        </p>
      </div>

      {/* Main Content Section */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* Left Column */}
        <div style={{ flex: "1 1 600px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <IncidentReports user={user} />
          </div>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <LocalEventsBusiness user={user} />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: "1 1 400px", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <Ads user={user} />
          </div>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <CommunityConnect user={user} />
          </div>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <NewsUpdates user={user} />
          </div>
        </div>
      </div>

      {/* Footer / Call-to-Action */}
      <div style={{
        marginTop: "40px",
        textAlign: "center",
        padding: "30px 20px",
        backgroundColor: "#f0f8ff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
          Ready to make your neighborhood safer?
        </h2>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Join thousands of Nigerians already using SafeConnect to build stronger, safer communities.
        </p>
        <button style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#1e90ff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Join Your Community
        </button>
      </div>
    </div>
  );
}

export default App;
