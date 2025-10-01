import React from "react";

// incidents: array of { title, description, location, address, state, reporter, date }
function IncidentList({ incidents }) {
  // Group incidents by state
  const grouped = incidents.reduce((acc, incident) => {
    const state = incident.state || "Unknown";
    if (!acc[state]) acc[state] = [];
    acc[state].push(incident);
    return acc;
  }, {});

  return (
    <div style={{ marginTop: "30px", maxWidth: "600px", margin: "30px auto" }}>
      <h3>Reported Incidents by State</h3>
      {Object.keys(grouped).length === 0 ? (
        <p>No incidents reported yet.</p>
      ) : (
        Object.entries(grouped).map(([state, stateIncidents]) => (
          <div key={state} style={{ marginBottom: "20px" }}>
            <h4 style={{ borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>{state}</h4>
            <ul>
              {stateIncidents.map((incident, idx) => (
                <li key={idx} style={{ marginBottom: "5px" }}>
                  <strong>{incident.title}</strong> – {incident.description} (
                  {incident.reporter}, {new Date(incident.date).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default IncidentList;
