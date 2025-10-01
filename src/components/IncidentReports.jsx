import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db, saveDB } from "../db";
import { statesAndLGAs } from "../data/statesAndLGAs";
import IncidentReportingLogo from "../assets/IncidentReporting.png";
import DraggableMarker from "./DraggableMarker";

// Cloudinary setup
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

// Incident titles
const INCIDENT_TITLES = [
  "Robbery", "Burglary (breaking and entering)", "Shoplifting", "Car theft", "Pickpocketing",
  "Vandalism", "Arson (Starting a fire)", "Trespassing", "Looting", "Kidnapping", "Assault",
  "Battery", "Homicide (murder)", "Manslaughter", "Domestic violence", "Sexual assault",
  "Child abuse", "Human trafficking", "Stalking", "Extortion", "Drug trafficking",
  "Illegal possession of firearms", "Smuggling", "Hit and run", "Drunk driving (DUI)", "Rioting",
];

function IncidentReporting({ user = null, onIncidentAdded }) {
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
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [reportAsGuest, setReportAsGuest] = useState(!user);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

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

  const addIncident = () => {
    if (!incident.title || !incident.location) {
      alert("Please provide a title and location for the incident.");
      return;
    }
    const finalIncident = {
      id: Date.now().toString(),
      ...incident,
      user: reportAsGuest ? "Guest" : user?.name || "Guest",
    };
    db.incidents.push(finalIncident);
    saveDB(db);
    onIncidentAdded?.(finalIncident); // notify parent map
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
    setLocationConfirmed(false);
  };

  // Image upload
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
    <div style={{ padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img src={IncidentReportingLogo} alt="Incident Reporting" style={{ height: "170px", objectFit: "contain" }} />
      </div>

      {/* Guest/User toggle */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <label style={{ marginRight: "10px" }}>
          <input type="radio" checked={reportAsGuest} onChange={() => setReportAsGuest(true)} />
          Report as Guest
        </label>
        {user && (
          <label>
            <input type="radio" checked={!reportAsGuest} onChange={() => setReportAsGuest(false)} />
            Report as {user.name}
          </label>
        )}
      </div>

      <p style={{ textAlign: "center", color: "#888", marginBottom: "10px" }}>
        You can report an incident. Guest details won’t be stored.
      </p>

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

      {/* Date Picker */}
      <div style={{ marginBottom: "10px" }}>
        <DatePicker
          selected={incident.date ? new Date(incident.date) : null}
          onChange={(date) => setIncident({ ...incident, date: date ? date.toISOString().split("T")[0] : "" })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select date dd/mm/yy"
          className="custom-input"
        />
      </div>

      {/* Time Picker */}
      <div style={{ marginBottom: "10px" }}>
        <DatePicker
          selected={incident.timeISO ? new Date(incident.timeISO) : null}
          onChange={(time) => setIncident({ ...incident, timeISO: time ? time.toISOString() : "" })}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeCaption="Time"
          dateFormat="HH:mm"
          placeholderText="Select time hh:mm"
          className="custom-input"
        />
      </div>

      {/* Description */}
      <textarea
        placeholder="Short Description"
        value={incident.description}
        onChange={(e) => setIncident({ ...incident, description: e.target.value })}
        style={{ width: "95%", marginBottom: "10px", padding: "8px" }}
      />

      {/* Image Upload */}
      <input type="file" onChange={handleFileChange} style={{ width: "100%", marginBottom: "10px" }} />
      {loading && <p>Uploading image...</p>}
      {incident.imageUrl && (
        <img src={incident.imageUrl} alt="Uploaded" style={{ width: "100px", marginBottom: "10px", borderRadius: "4px" }} />
      )}

      {/* Map */}
      <MapContainer
        center={incident.location ? [incident.location.latitude, incident.location.longitude] : [9.0820, 8.6753]}
        zoom={6}
        style={{ height: "300px", width: "100%", marginBottom: "10px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker
          incident={incident}
          setIncident={setIncident}
          locationConfirmed={locationConfirmed}
          setLocationConfirmed={setLocationConfirmed}
        />
      </MapContainer>

      <button
        type="button"
        onClick={() => setLocationConfirmed(true)}
        disabled={locationConfirmed || !incident.location}
        style={{ width: "100%", padding: "10px", backgroundColor: "#066c4a", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", marginBottom: "10px" }}
      >
        Confirm Location 📍
      </button>

      {/* State & LGA */}
      <select
        value={incident.state}
        onChange={(e) => setIncident({ ...incident, state: e.target.value, lga: "" })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select State</option>
        {Object.keys(statesAndLGAs).map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        value={incident.lga}
        onChange={(e) => setIncident({ ...incident, lga: e.target.value })}
        disabled={!incident.state}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select LGA</option>
        {incident.state &&
          statesAndLGAs[incident.state].map((lga) => (
            <option key={lga} value={lga}>{lga}</option>
          ))}
      </select>

      {/* Address Display */}
      <p style={{ fontStyle: "italic", color: "#444", marginBottom: "10px" }}>
        {incident.address ? `Current Address: ${incident.address}` : "GPS not selected"}
      </p>

      <button
        type="button"
        onClick={addIncident}
        style={{ width: "100%", padding: "10px", backgroundColor: "#066c4a", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}
      >
        Report Incident 📝
      </button>
    </div>
  );
}

export default IncidentReporting;
