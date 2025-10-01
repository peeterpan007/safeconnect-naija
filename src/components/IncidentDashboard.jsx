import React from "react";
import IncidentReporting from "./IncidentReporting";
import IncidentMap from "./IncidentMap";
import { useIncidents } from "./IncidentContext";

export default function IncidentDashboard({ user }) {
  const { incidents } = useIncidents();

  // Group incidents by state
  const incidentsByState = incidents.reduce((acc, inc) => {
    if (!acc[inc.state]) acc[inc.state] = [];
    acc[inc.state].push(inc);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <IncidentReporting user={user} />
      <h3 style={{ textAlign: "center", margin: "20px 0", color: "#066c4a" }}>Incident Location Map</h3>
      <IncidentMap />

      <h3 style={{ marginTop: "20px", color: "#066c4a" }}>Reported Incidents by State</h3>
      {Object.keys(incidentsByState).map((state) => (
        <div key={state} style={{ marginBottom: "10px" }}>
          <h4 style={{ color: "#0a4a2a" }}>{state}</h4>
          <ul>
            {incidentsByState[state].map((inc) => (
              <li key={inc.id}>
                <strong>{inc.title}</strong> — {inc.description} (Reported by: {inc.user})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
