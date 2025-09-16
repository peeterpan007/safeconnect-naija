import React from "react";
import { db } from "../db";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function IncidentMap() {
  // If no incidents have GPS, default map center
  const defaultCenter = [9.082, 8.6753]; // Nigeria approximate center
  const incidentsWithLocation = db.incidents.filter((i) => i.location);

  const center = incidentsWithLocation.length
    ? [
        incidentsWithLocation[0].location.latitude,
        incidentsWithLocation[0].location.longitude,
      ]
    : defaultCenter;

  return (
    <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />

        {incidentsWithLocation.map((i) => (
          <Marker
            key={i.id}
            position={[i.location.latitude, i.location.longitude]}
          >
            <Popup>
              <strong>{i.title}</strong> ({i.category})<br />
              🕒 {i.timestamp}<br />
              {i.state && i.lga && (
                <span>{i.state}, {i.lga}</span>
              )}<br />
              {i.description}<br />
              {i.imageUrl && (
                <img
                  src={i.imageUrl}
                  alt="Incident"
                  style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }}
                />
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}