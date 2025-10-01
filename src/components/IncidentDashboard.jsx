import React, { useState } from "react";
import IncidentReporting from "./IncidentReporting";
import IncidentMap from "./IncidentMap";

function IncidentDashboard({ user }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");

  const handleIncidentAdded = (incident) => {
    // Update map location when an incident with location is added
    if (incident.location) {
      setCurrentLocation(incident.location);
      setCurrentAddress(incident.address);
    }
    alert("Incident submitted successfully!");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <IncidentReporting user={user} onIncidentAdded={handleIncidentAdded} />

      <h3 style={{ textAlign: "center", margin: "20px 0", color: "#066c4a" }}>
        Incident Location Map
      </h3>
      <IncidentMap location={currentLocation} address={currentAddress} height="400px" />
    </div>
  );
}

export default IncidentDashboard;
