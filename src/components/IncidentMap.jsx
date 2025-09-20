import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const IncidentMap = () => {
  useEffect(() => {
    // Only initialize map if not already created
    const map = L.map("map").setView([9.082, 8.6753], 6); // Coordinates of Nigeria

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Example marker
    L.marker([9.082, 8.6753]).addTo(map).bindPopup("Sample Incident").openPopup();

    return () => {
      map.remove(); // Clean up on unmount
    };
  }, []);

  return (
    <div id="map" style={{ height: "400px", width: "100%" }}></div>
  );
};

export default IncidentMap;
