import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

export default function IncidentMap({ incidents = [], currentIncident = null }) {
  return (
    <div style={{ height: "400px", width: "100%", marginBottom: "10px" }}>
      <MapContainer center={[9.082, 8.6753]} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Auto-pan to current incident */}
        {currentIncident?.location && <AutoPan location={currentIncident.location} />}

        {/* All past incidents */}
        {incidents.map((inc) =>
          inc.location ? (
            <Marker key={inc.id} position={[inc.location.latitude, inc.location.longitude]}>
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
          ) : null
        )}

        {/* Current incident with pulsing marker */}
        {currentIncident?.location && (
          <Marker
            position={[currentIncident.location.latitude, currentIncident.location.longitude]}
            icon={pulsingIcon}
          >
            <Popup>
              <strong>{currentIncident.title || "New Incident"}</strong>
              <br />
              {currentIncident.description}
              <br />
              {currentIncident.address}
            </Popup>
          </Marker>
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
          0% {
            transform: scale(0.7);
            opacity: 1;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
