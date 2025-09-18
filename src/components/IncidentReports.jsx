import React, { useState, useEffect } from "react";
import { db, saveDB } from "../db";
import { statesAndLGAs } from "../data/statesAndLGAs";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import IncidentReportingLogo from "../assets/IncidentReporting.png"; // ✅ logo

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

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

// Predefined incident titles
const INCIDENT_TITLES = [
  "Robbery",
  "Burglary (breaking and entering)",
  "Shoplifting",
  "Car theft",
  "Pickpocketing",
  "Vandalism",
  "Arson (Starting a fire)",
  "Trespassing",
  "Looting",
  "Kidnapping",
  "Assault",
  "Battery",
  "Homicide (murder)",
  "Manslaughter",
  "Domestic violence",
  "Sexual assault",
  "Child abuse",
  "Human trafficking",
  "Stalking",
  "Extortion",
  "Drug trafficking",
  "Illegal possession of firearms",
  "Smuggling",
  "Hit and run",
  "Drunk driving (DUI)",
  "Rioting",
];

function IncidentReports({ user }) {
  const [incident, setIncident] = useState({
    title: "",
    date: "",
    timeISO: "",
    timestamp: "",
    description: "",
    imageUrl: "",
    state: "",
    lga: "",
    location: null,
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [useCustomTitle, setUseCustomTitle] = useState(false);

  // Live timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const iso = now.toISOString();
      const formatted = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setIncident((prev) => ({ ...prev, timeISO: iso, timestamp: formatted }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.display_name || "Unknown location";

          setIncident((prev) => ({
            ...prev,
            location: { latitude, longitude },
            address: addr,
          }));
        } catch {
          setIncident((prev) => ({
            ...prev,
            location: { latitude, longitude },
            address: "Coordinates only",
          }));
        }
      },
      (err) => {
        console.error(err);
        alert("Could not fetch location. Enable GPS.");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );

    setWatchId(id);
  };

  // Stop GPS tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Save incident
  const addIncident = () => {
    const finalIncident = { id: Date.now().toString(), ...incident };
    db.incidents.push(finalIncident);
    saveDB(db);

    setIncident({
      title: "",
      date: "",
      timeISO: "",
      timestamp: "",
      description: "",
      imageUrl: "",
      state: "",
      lga: "",
      location: null,
      address: "",
    });
    setUseCustomTitle(false);
    stopTracking();
  };

  // Handle file upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setIncident((prev) => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      {/* Header with Bigger Logo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <img
          src={IncidentReportingLogo}
          alt="Incident Reporting"
          style={{ height: "70px", objectFit: "contain" }} // ✅ Bigger logo
        />
      </div>

      {/* Live Time */}
      <p style={{ textAlign: "center", fontWeight: "bold", color: "#555", marginBottom: "15px" }}>
        🕒 Live Time: {incident.timestamp}
      </p>

      {/* Incident Title */}
      <div style={{ marginBottom: "10px" }}>
        {!useCustomTitle ? (
          <select
            value={incident.title}
            onChange={(e) => {
              if (e.target.value === "Other") {
                setIncident({ ...incident, title: "" });
                setUseCustomTitle(true);
              } else {
                setIncident({ ...incident, title: e.target.value });
              }
            }}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select Incident Title</option>
            {INCIDENT_TITLES.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
            <option value="Other">Other (type below)</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Enter custom incident title"
            value={incident.title}
            onChange={(e) => setIncident({ ...incident, title: e.target.value })}
            style={{ width: "100%", padding: "8px" }}
          />
        )}
      </div>

      {/* Date & Description */}
      <input type="date" value={incident.date} onChange={(e) => setIncident({ ...incident, date: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px" }} />
      <textarea placeholder="Short Description" value={incident.description} onChange={(e) => setIncident({ ...incident, description: e.target.value })} style={{ width: "100%", marginBottom: "10px", padding: "8px" }} />

      {/* Image Upload */}
      <input type="file" onChange={handleFileChange} style={{ width: "100%", marginBottom: "10px" }} />
      {loading && <p>Uploading image...</p>}
      {incident.imageUrl && <img src={incident.imageUrl} alt="Uploaded" style={{ width: "100px", marginBottom: "10px", borderRadius: "4px" }} />}

      {/* GPS Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button type="button" onClick={startTracking} style={{ flex: 1, padding: "10px", backgroundColor: "#066c4aff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Start Live Location 🌍</button>
        <button type="button" onClick={stopTracking} style={{ flex: 1, padding: "10px", backgroundColor: "#b70909ff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Stop Tracking ⏹️</button>
      </div>

      {/* Map */}
      {incident.location && (
        <MapContainer center={[incident.location.latitude, incident.location.longitude]} zoom={15} style={{ height: "200px", width: "100%", marginBottom: "10px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' />
          <Marker position={[incident.location.latitude, incident.location.longitude]}>
            <Popup>{incident.title || "Incident Location"}</Popup>
          </Marker>
        </MapContainer>
      )}

      {/* State & LGA */}
      <select value={incident.state} onChange={(e) => setIncident({ ...incident, state: e.target.value, lga: "" })} style={{ width: "100%", marginBottom: "10px", padding: "8px" }}>
        <option value="">Select State</option>
        {Object.keys(statesAndLGAs).map((state) => (<option key={state} value={state}>{state}</option>))}
      </select>

      <select value={incident.lga} onChange={(e) => setIncident({ ...incident, lga: e.target.value })} disabled={!incident.state} style={{ width: "100%", marginBottom: "10px", padding: "8px" }}>
        <option value="">Select LGA</option>
        {incident.state && statesAndLGAs[incident.state].map((lga) => (<option key={lga} value={lga}>{lga}</option>))}
      </select>

      <button onClick={addIncident} style={{ width: "100%", padding: "10px", backgroundColor: "#0c0ab1ff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Incident</button>
    </div>
  );
}

export default IncidentReports;
