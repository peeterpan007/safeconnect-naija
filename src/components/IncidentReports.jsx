import React, { useState, useContext } from "react";
import { IncidentContext } from "./IncidentContext";

export default function IncidentReport({ user }) {
  const { incidents, addIncident, setCurrentIncident } = useContext(IncidentContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);

  const shareLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Optional: convert coordinates to address via reverse geocoding API
        const address = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;

        setLocation({ latitude, longitude, address });
        alert(`Location shared: ${address}`);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) return alert("Please provide a title for the incident.");
    if (!description.trim()) return alert("Please provide a description.");
    if (!location) return alert("Please share your location first.");

    const newIncident = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      location,
      user: user || "Guest",
    };

    addIncident(newIncident);
    setCurrentIncident(newIncident);

    // Reset form
    setTitle("");
    setDescription("");
    setLocation(null);

    alert("Incident submitted successfully!");
  };

  return (
    <div className="incident-report">
      <h2>Report Incident {user ? `as ${user}` : "as Guest"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter incident title"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident"
            required
          />
        </div>

        <div>
          <button type="button" onClick={shareLocation}>
            {location ? "Location Shared ✅" : "Share Location"}
          </button>
        </div>

        <div>
          <button type="submit" disabled={!title.trim() || !description.trim() || !location}>
            Submit Incident
          </button>
        </div>
      </form>
    </div>
  );
}
