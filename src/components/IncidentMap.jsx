import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useIncidents } from "./IncidentContext";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Pulsing marker CSS icon
const pulsingIcon = L.divIcon({
  className: "pulsing-marker",
  html: `<div class="pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Auto-pan component
function AutoPan({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], map.getZoom(), { animate: true });
    }
  }, [location, map]);
  return null;
}

// Group incidents by state
const groupByState = (incidents) => {
  return incidents.reduce((acc, inc) => {
    const state = inc.location?.state || "Unknown";
    if (!acc[state]) acc[state] = [];
    acc[state].push(inc);
    return acc;
  }, {});
};

export default function IncidentMap() {
  const { incidents, currentIncident } = useIncidents();
  const grouped = groupByState(incidents);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Map */}
      <div style={{ flex: 2, height: "500px" }}>
        <MapContainer center={[9.082, 8.6753]} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {currentIncident?.location && <AutoPan location={currentIncident.location} />}

          {incidents.map(
            (inc) =>
              inc.location && (
                <Marker
                  key={inc.id}
                  position={[inc.location.latitude, inc.location.longitude]}
                  icon={inc === currentIncident ? pulsingIcon : undefined}
                >
                  <Popup>
                    <strong>{inc.title}</strong>
                    <br />
                    {inc.description}
                    <br />
                    {inc.address}
                    <br />
                    {inc.user && <em>Reported by: {inc.user}</em>}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>

        {/* Pulsing marker CSS */}
        <style>{`
          .pulsing-marker .pulse {
            width: 20px;
            height: 20px;
            background: rgba(0, 200, 0, 0.7);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
            border: 2px solid #0a0;
          }

          @keyframes pulse {
            0% { transform: scale(0.7); opacity: 1; }
            70% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(0.7); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Incident list grouped by state */}
      <div style={{ flex: 1, maxHeight: "500px", overflowY: "auto", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Incidents by State</h3>
        {Object.keys(grouped).length === 0 && <p>No incidents reported yet.</p>}
        {Object.entries(grouped).map(([state, incidents]) => (
          <div key={state} style={{ marginBottom: "15px" }}>
            <h4>{state}</h4>
            <ul>
              {incidents.map((inc) => (
                <li key={inc.id}>
                  <strong>{inc.title}</strong> - {inc.description} <em>({inc.user || "Guest"})</em>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
