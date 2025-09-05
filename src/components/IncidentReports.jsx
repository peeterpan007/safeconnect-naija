import React, { useState } from "react";
import { db, saveDB } from "../db";
import { statesAndLGAs } from "../data/statesAndLGAs";

function IncidentReports({ user }) {
  const [incident, setIncident] = useState({
    title: "",
    date: "",
    description: "",
    imageUrl: "",
    file: null,
    category: "",
    state: "",
    lga: "",
  });

  function addIncident() {
    db.incidents.push({ id: Date.now().toString(), ...incident });
    saveDB(db);
    setIncident({
      title: "",
      date: "",
      description: "",
      imageUrl: "",
      file: null,
      category: "",
      state: "",
      lga: "",
    });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setIncident({ ...incident, file: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h2>Incident Reports</h2>

      <input
        placeholder="Incident Title"
        value={incident.title}
        onChange={e => setIncident({ ...incident, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="date"
        value={incident.date}
        onChange={e => setIncident({ ...incident, date: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <textarea
        placeholder="Short Description"
        value={incident.description}
        onChange={e => setIncident({ ...incident, description: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Image URL"
        value={incident.imageUrl}
        onChange={e => setIncident({ ...incident, imageUrl: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <select
        value={incident.category}
        onChange={e => setIncident({ ...incident, category: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select Category</option>
        <option>Robbery</option>
        <option>Kidnapping</option>
        <option>Communal clash</option>
        <option>Flooding</option>
        <option>Road block</option>
        <option>Motor accident</option>
        <option>Communal attack</option>
        <option>Other Alerts</option>
      </select>

      <select
        value={incident.state}
        onChange={e => setIncident({ ...incident, state: e.target.value, lga: "" })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select State</option>
        {Object.keys(statesAndLGAs).map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>

      <select
        value={incident.lga}
        onChange={e => setIncident({ ...incident, lga: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        disabled={!incident.state}
      >
        <option value="">Select LGA</option>
        {incident.state && statesAndLGAs[incident.state].map(lga => (
          <option key={lga} value={lga}>{lga}</option>
        ))}
      </select>

      <button
        onClick={addIncident}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1e90ff",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Add Incident
      </button>

      <h3 style={{ marginTop: "20px" }}>Existing Incidents</h3>
      <ul>
        {db.incidents.map(i => (
          <li key={i.id} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #eee", borderRadius: "5px" }}>
            <strong>{i.title}</strong> ({i.date}) - {i.category}<br/>
            {i.state && i.lga && <span>{i.state}, {i.lga}</span>}<br/>
            {i.description}<br/>
            {i.imageUrl && <img src={i.imageUrl} alt="" style={{ width: "100px", display: "block", marginTop: "5px" }} />}
            {i.file && <img src={i.file} alt="" style={{ width: "100px", display: "block", marginTop: "5px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncidentReports;
