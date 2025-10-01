// src/components/IncidentMap.jsx
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useIncidents } from "./IncidentContext";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 9.082, // Nigeria approx center
  lng: 8.6753,
};

function IncidentMap() {
  const { incidents } = useIncidents();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ add your API key in .env
  });

  // Group incidents by state (roughly splitting by first word in location)
  const groupedIncidents = incidents.reduce((groups, incident) => {
    const state = incident.location.split(",").pop().trim() || "Unknown";
    if (!groups[state]) groups[state] = [];
    groups[state].push(incident);
    return groups;
  }, {});

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ color: "#066c4a" }}>Incident Map</h2>

      {isLoaded ? (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={{
                lat: Number(incident.location.split(",")[0]) || 9.082,
                lng: Number(incident.location.split(",")[1]) || 8.6753,
              }}
              title={incident.title}
            />
          ))}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}

      <h3 style={{ marginTop: "20px", color: "#066c4a" }}>Incidents by State</h3>
      <div>
        {Object.entries(groupedIncidents).map(([state, stateIncidents]) => (
          <div key={state} style={{ marginBottom: "15px" }}>
            <h4 style={{ color: "#333" }}>{state}</h4>
            <ul>
              {stateIncidents.map((incident) => (
                <li key={incident.id}>
                  <strong>{incident.title}</strong> - {incident.description || "No description"}
                  <br />
                  <em>{incident.location}</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IncidentMap;
