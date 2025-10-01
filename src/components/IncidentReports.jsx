import React, { useState, useEffect } from "react";
import IncidentMap from "./IncidentMap";

function IncidentReports({ user }) {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");

  // Get current location on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(5)},${longitude.toFixed(5)}`);
      },
      (err) => {
        console.warn("Error getting location:", err.message);
      }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !state || !location) {
      alert("Please fill in all fields including your location.");
      return;
    }

    const newIncident = {
      title,
      description,
      state,
      location,
      address,
    };

    setIncidents([newIncident, ...incidents]);
    setTitle("");
    setDescription("");
    setState("");
    // Keep location for next submission
    alert("Incident submitted successfully!");
  };

  // Group incidents by state
  const incidentsByState = incidents.reduce((acc, incident) => {
    if (!acc[incident.state]) acc[incident.state] = [];
    acc[incident.state].push(incident);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Report an Incident</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Your Location (auto-detected)"
          value={address}
          readOnly
          style={{ width: "100%", marginBottom: "10px", backgroundColor: "#f0f0f0" }}
        />
        <button type="submit">Submit Incident</button>
      </form>

      {/* Map showing all incidents */}
      {incidents.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Incident Map</h3>
          <IncidentMap incidents={incidents} height="400px" />
        </div>
      )}

      {/* List of incidents grouped by state */}
      {Object.keys(incidentsByState).map((stateName) => (
        <div key={stateName} style={{ marginTop: "20px" }}>
          <h3>{stateName}</h3>
          <ul>
            {incidentsByState[stateName].map((incident, idx) => (
              <li key={idx}>
                <strong>{incident.title}</strong>: {incident.description} ({incident.address})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default IncidentReports;
