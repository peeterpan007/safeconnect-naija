import React, { useState } from "react";
import { useIncidents } from "./IncidentContext";

export default function IncidentReports({ user, guest }) {
  const { addIncident } = useIncidents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);

  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    setWatchId(id);
    setTracking(true);
  };

  // Stop GPS tracking
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
  };

  // Reverse geocode coordinates → full address
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(coords);
        fetchAddress(coords.latitude, coords.longitude);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !location) {
      alert("Please provide a title and location for the incident.");
      return;
    }

    const newIncident = {
      id: Date.now().toString(),
      title,
      description,
      state,
      lga,
      address,
      location,
      user: guest ? "Anonymous" : user?.name || "Anonymous",
      createdAt: new Date().toISOString(),
    };

    addIncident(newIncident);

    // reset form
    setTitle("");
    setDescription("");
    setState("");
    setLga("");
    setAddress("");
    setLocation(null);

    alert("Incident submitted successfully!");
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2 style={{ textAlign: "center", color: "#066c4a" }}>
        {guest ? "Report as Guest" : `Report as ${user?.name || "Anonymous"}`}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
        <input
          type="text"
          placeholder="Incident Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Incident Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={textareaStyle}
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="LGA"
          value={lga}
          onChange={(e) => setLga(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Address (auto-filled if you share location)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />

        {/* Location & GPS Controls */}
        <div style={{ marginTop: "10px" }}>
          <button
            type="button"
            onClick={handleShareLocation}
            style={{ ...buttonStyle, backgroundColor: "#066c4a", color: "white" }}
          >
            Share My Location
          </button>
          {!tracking ? (
            <button
              type="button"
              onClick={startTracking}
              style={{ ...buttonStyle, backgroundColor: "green", color: "white" }}
            >
              Start GPS
            </button>
          ) : (
            <button
              type="button"
              onClick={stopTracking}
              style={{ ...buttonStyle, backgroundColor: "red", color: "white" }}
            >
              Stop GPS
            </button>
          )}
        </div>

        {location && (
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
            📍 Location set: {location.latitude.toFixed(5)},{" "}
            {location.longitude.toFixed(5)}
          </p>
        )}

        <button
          type="submit"
          style={{
            ...buttonStyle,
            backgroundColor: "#066c4a",
            color: "white",
            marginTop: "15px",
          }}
        >
          Submit Incident
        </button>
      </form>
    </div>
  );
}

// Inline styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "80px",
};

const buttonStyle = {
  padding: "10px 15px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
};
