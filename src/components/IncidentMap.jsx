// src/components/IncidentMap.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useIncident } from "./IncidentContext"; // ✅ Fixed import name

// Fix Leaflet default icon URLs (important for production)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function FitBounds({ incidents }) {
  const map = useMap();
  useEffect(() => {
    const points = incidents
      .filter((i) => i.location && typeof i.location.latitude === "number")
      .map((i) => [i.location.latitude, i.location.longitude]);

    if (points.length === 0) return;

    try {
      map.fitBounds(points, { padding: [50, 50] });
    } catch (err) {
      // ignore
    }
  }, [incidents, map]);
  return null;
}

export default function IncidentMap() {
  const { incidents } = useIncident(); // ✅ fixed usage

  // group by state
  const grouped = incidents.reduce((acc, inc) => {
    const s = inc.state || "Unknown";
    if (!acc[s]) acc[s] = [];
    acc[s].push(inc);
    return acc;
  }, {});

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ color: "#066c4a" }}>Incident Map</h3>

      <div style={{ height: 400, marginBottom: 12 }}>
        <MapContainer center={[9.082, 8.6753]} zoom={6} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitBounds incidents={incidents} />

          {incidents.map((inc) =>
            inc.location ? (
              <Marker key={inc.id} position={[inc.location.latitude, inc.location.longitude]}>
                <Popup>
                  <strong>{inc.title}</strong><br />
                  {inc.description || "No description"}<br />
                  {inc.address && <small>{inc.address}</small>}<br />
                  <em>By: {inc.user}</em>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <h4 style={{ marginTop: 8 }}>Incidents by State</h4>
      {Object.keys(grouped).length === 0 ? (
        <p>No incidents reported yet.</p>
      ) : (
        Object.entries(grouped).map(([st, arr]) => (
          <div key={st} style={{ marginBottom: 12 }}>
            <h5 style={{ margin: "6px 0" }}>
              {st} ({arr.length})
            </h5>
            <ul>
              {arr.map((i) => (
                <li key={i.id}>
                  <strong>{i.title}</strong> — {i.description || "No description"}
                  <br />
                  <small>
                    {i.address ||
                      (i.location
                        ? `${i.location.latitude.toFixed(5)}, ${i.location.longitude.toFixed(5)}`
                        : "No location")}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
