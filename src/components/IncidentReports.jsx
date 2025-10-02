// src/components/IncidentReports.jsx
import React, { useEffect, useState } from "react";
import { useIncidents } from "./IncidentContext";
import { useUser } from "./UserContext";
import { statesAndLGAs } from "../data/statesAndLGAs"; // keep your existing states/LGAs file if present

// Fix Leaflet icon references if you import leaflet elsewhere (kept out of this file intentionally)

export default function IncidentReports({ guest = false }) {
  const { addIncident } = useIncidents();
  const { user } = useUser();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stateName, setStateName] = useState("");
  const [lga, setLga] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [address, setAddress] = useState("");
  const [watchId, setWatchId] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  // Live timestamp
  const [timestamp, setTimestamp] = useState("");
  useEffect(() => {
    const t = setInterval(() => setTimestamp(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Start watching (live)
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        console.error(err);
        alert("Could not get location. Check device permissions.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Share location once and reverse-geocode via Nominatim (OpenStreetMap)
  const shareLocationOnce = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setAddress(data.display_name || `${latitude.toFixed(5)},${longitude.toFixed(5)}`);
        } catch (err) {
          console.warn("reverse geocode failed", err);
          setAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
      },
      (err) => {
        console.error(err);
        alert("Could not fetch location. Allow location permission.");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
  };

  // Optional image upload: If you want to upload to Cloudinary, fill CLOUDINARY_URL/UPLOAD_PRESET env or skip
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || "";
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || "";

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      // If not configured, just create a local URL preview
      setImageUrl(URL.createObjectURL(file));
      return;
    }
    setLoadingUpload(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: fd });
      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  // Add incident: **will allow submit regardless of all fields being complete** per your request.
  const handleAddIncident = () => {
    const finalIncident = {
      id: Date.now().toString(),
      title: title || "Untitled",
      description: description || "",
      state: stateName || "",
      lga: lga || "",
      imageUrl: imageUrl || "",
      location: location || null,
      address: address || "",
      user: user?.guest ? "Guest" : user?.name || (guest ? "Guest" : "Anonymous"),
      createdAt: new Date().toISOString(),
    };
    addIncident(finalIncident);

    // Reset most fields, but keep location if you want; here we reset everything
    setTitle("");
    setDescription("");
    setStateName("");
    setLga("");
    setImageUrl("");
    setLocation(null);
    setAddress("");
    stopTracking();
    alert("Incident submitted — thank you!");
  };

  // Populate LGAs if statesAndLGAs is available (otherwise ignore)
  const lgasForState = stateName && statesAndLGAs && statesAndLGAs[stateName] ? statesAndLGAs[stateName] : [];

  return (
    <div style={{ margin: "12px", padding: 12, background: "#fff", borderRadius: 8 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0, color: "#066c4a" }}>{guest ? "Report as Guest" : `Report incident (${user?.name || "You"})`}</h3>
        <small style={{ color: "#666" }}>Live time: {timestamp}</small>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        <textarea placeholder="Short description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />

        <div style={{ display: "flex", gap: 8 }}>
          <select value={stateName} onChange={(e) => { setStateName(e.target.value); setLga(""); }} style={{ flex: 1, padding: 8 }}>
            <option value="">Select State (optional)</option>
            {statesAndLGAs ? Object.keys(statesAndLGAs).map((s) => <option key={s} value={s}>{s}</option>) : null}
          </select>
          <select value={lga} onChange={(e) => setLga(e.target.value)} disabled={!stateName} style={{ flex: 1, padding: 8 }}>
            <option value="">Select LGA (optional)</option>
            {lgasForState.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>

        <input type="file" onChange={handleFileChange} />

        {loadingUpload && <small>Uploading image…</small>}
        {imageUrl && <img src={imageUrl} alt="preview" style={{ width: 84, borderRadius: 6 }} />}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={shareLocationOnce} style={{ ...gpsBtn, background: "#066c4a" }}>Share Location</button>
          {!watchId ? (
            <button onClick={startTracking} style={{ ...gpsBtn, background: "green" }}>Start GPS</button>
          ) : (
            <button onClick={stopTracking} style={{ ...gpsBtn, background: "red" }}>Stop GPS</button>
          )}
        </div>

        <p style={{ fontStyle: "italic", color: "#444" }}>{address ? `Address: ${address}` : (location ? `Coordinates: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : "Location not set")}</p>

        <div style={{ textAlign: "center" }}>
          <button onClick={handleAddIncident} style={{ padding: "10px 18px", background: "#066c4a", color: "#fff", borderRadius: 6 }}>
            Add Incident
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: 8, borderRadius: 6, border: "1px solid #ddd", width: "100%" };
const gpsBtn = { flex: 1, padding: "10px", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
