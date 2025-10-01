// src/components/IncidentReports.jsx
import React, { useState } from "react";
import { useIncidents } from "./IncidentContext";

function IncidentReports({ user, guest }) {
  const { addIncident } = useIncidents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("General");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim()) {
      alert("Please provide a title and location for the incident.");
      return;
    }

    const newIncident = {
      id: Date.now(),
      title,
      description,
      location,
      category,
      user: user ? user.name : "Guest",
      timestamp: new Date().toISOString(),
    };

    addIncident(newIncident);

    // Clear form
    setTitle("");
    setDescription("");
    setLocation("");
    setCategory("General");

    alert("Incident submitted successfully!");
  };

  if (guest) {
    return (
      <div className="view-only-message">
        Guests can only view reported incidents. Please login or sign up to report.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2 style={{ color: "#066c4a" }}>Report an Incident</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Location (address, landmark, or coordinates):</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          >
            <option value="General">General</option>
            <option value="Safety">Safety</option>
            <option value="Health">Health</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#066c4a",
            color: "white",
            padding: "10px 15px",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Submit Incident
        </button>
      </form>
    </div>
  );
}

export default IncidentReports;
