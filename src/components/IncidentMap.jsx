import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { db } from "../db"; // Import the same db used in IncidentReports

const IncidentMap = ({ filterState = "", filterLGA = "" }) => {
  useEffect(() => {
    // Initialize map
    const map = L.map("map").setView([9.082, 8.6753], 6); // Nigeria center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Filter incidents based on state/LGA if provided
    const filteredIncidents = db.incidents.filter((incident) => {
      const matchesState = filterState ? incident.state === filterState : true;
      const matchesLGA = filterLGA ? incident.lga === filterLGA : true;
      return matchesState && matchesLGA && incident.location;
    });

    // Add markers for each incident
    filteredIncidents.forEach((incident) => {
      L.marker([incident.location.latitude, incident.location.longitude])
        .addTo(map)
        .bindPopup(
          `<b>${incident.title}</b><br/>
          ${incident.description || ""}<br/>
          ${incident.address || ""}<br/>
          ${incident.date ? `Date: ${incident.date}` : ""}`
        );
    });

    return () => {
      map.remove(); // Clean up
    };
  }, [filterState, filterLGA]); // re-run effect if filters change

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default IncidentMap;
