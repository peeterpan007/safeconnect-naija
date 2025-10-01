import React, { useState, useEffect } from "react";
import { db, saveDB } from "../db";
import { statesAndLGAs } from "../data/statesAndLGAs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IncidentReportingLogo from "../assets/IncidentReporting.png";
import IncidentMap from "./IncidentMap";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

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
  const [watchId, setWatchId] = useState(null);
  const [useCustomTitle, setUseCustomTitle] = useState(false);
  const [reportAsGuest, setReportAsGuest] = useState(!user);

  // Live timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setIncident((prev) => ({
        ...prev,
        timeISO: now.toISOString(),
        timestamp: now.toLocaleString("en-GB", { hour12: false }),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIncident((prev) => ({
          ...prev,
          location: { latitude, longitude },
          address: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
        }));
      },
      () => alert("Enable GPS to track location."),
      { enableHighAccuracy: true }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
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
    } catch {
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Submit
  const addIncident = () => {
    if (!incident.title || !incident.location) {
      alert("Title and location are required.");
      return;
    }
    const finalIncident = {
      id: Date.now().toString(),
      ...incident,
      user: reportAsGuest ? "Anonymous" : user?.name || "Anonymous",
    };
    db.incidents.push(finalIncident);
    saveDB(db);
    onIncidentAdded?.(finalIncident);

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

  // Handle map location selection
  const handleMapSelect = (latlng) => {
    setIncident((prev) => ({
      ...prev,
      location: { latitude: latlng.lat, longitude: latlng.lng },
      address: `Lat: ${latlng.lat.toFixed(5)}, Lng: ${latlng.lng.toFixed(5)}`,
    }));
  };

  return (
    <div style={{ padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img src={IncidentReportingLogo} alt="Incident Reporting" style={{ height: "170px", objectFit: "contain" }} />
      </div>

      {/* Guest/User toggle */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {user ? (
          <>
            <label style={{ marginRight: "10px" }}>
              <input type="radio" checked={reportAsGuest} onChange={() => setReportAsGuest(true)} /> Report Anonymously
            </label>
            <label>
              <input type="radio" checked={!reportAsGuest} onChange={() => setReportAsGuest(false)} /> Report as {user.name}
            </label>
          </>
        ) : (
          <span style={{ fontWeight: "bold", color: "#333" }}>Reporting as Guest</span>
        )}
      </div>

      <p style={{ textAlign: "center", fontWeight: "bold", color: "#555", marginBottom: "15px" }}>
        🕒 Live Time: {incident.timestamp}
      </p>

      {/* Incident Title */}
      <div style={{ marginBottom: "10px" }}>
        {!useCustomTitle ? (
          <select
            value={incident.title}
            onChange={(e) => {
              if (e.target.value === "Other") setUseCustomTitle(true);
              setIncident({ ...incident, title: e.target.value });
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

      {/* Date & Time */}
      <div style={{ marginBottom: "10px" }}>
        <DatePicker
          selected={incident.date ? new Date(incident.date) : null}
          onChange={(date) => setIncident({ ...incident, date: date ? date.toISOString().split("T")[0] : "" })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select date"
          className="custom-input"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <DatePicker
          selected={incident.timeISO ? new Date(incident.timeISO) : null}
          onChange={(time) => setIncident({ ...incident, timeISO: time ? time.toISOString() : "" })}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={5}
          timeCaption="Time"
          dateFormat="HH:mm"
          placeholderText="Select time"
          className="custom-input"
        />
      </div>

      {/* Description & Image */}
      <textarea
        placeholder="Short Description"
        value={incident.description}
        onChange={(e) => setIncident({ ...incident, description: e.target.value })}
        style={{ width: "95%", marginBottom: "10px", padding: "8px" }}
      />
      <input type="file" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
      {loading && <p style={{ color: "#888" }}>Uploading image...</p>}
      {incident.imageUrl && <img src={incident.imageUrl} alt="Uploaded" style={{ width: "100%", marginBottom: "10px" }} />}

      {/* State & LGA */}
      <select
        value={incident.state}
        onChange={(e) => setIncident({ ...incident, state: e.target.value })}
        style={{ width: "48%", marginRight: "4%", padding: "8px", marginBottom: "10px" }}
      >
        <option value="">Select State</option>
        {Object.keys(statesAndLGAs).map((st) => (
          <option key={st} value={st}>{st}</option>
        ))}
      </select>
      <select
        value={incident.lga}
        onChange={(e) => setIncident({ ...incident, lga: e.target.value })}
        style={{ width: "48%", padding: "8px", marginBottom: "10px" }}
      >
        <option value="">Select LGA</option>
        {incident.state && statesAndLGAs[incident.state].map((lga) => <option key={lga} value={lga}>{lga}</option>)}
      </select>

      {/* GPS */}
      <div style={{ marginBottom: "10px" }}>
        <button type="button" onClick={startTracking} disabled={watchId !== null} style={{ marginRight: "10px" }}>Start GPS</button>
        <button type="button" onClick={stopTracking} disabled={watchId === null}>Stop GPS</button>
      </div>
      {incident.address && <p>Location: {incident.address}</p>}

      {/* Map Selection */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontWeight: "bold" }}>Or select location on map:</p>
        <IncidentMap onLocationSelect={handleMapSelect} />
      </div>

      <button type="button" onClick={addIncident} style={{ padding: "10px 20px", marginTop: "10px" }}>Submit Incident</button>
    </div>
  );
}

export default IncidentReporting;
