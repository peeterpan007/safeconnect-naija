// src/components/IncidentReport.jsx
import React, { useState } from "react";
import { useIncidents } from "./IncidentContext";

const statesAndLGAs = {
  Lagos: ["Ikeja", "Epe", "Badagry"],
  Abuja: ["Garki", "Wuse", "Asokoro"],
  // add other states and LGAs as needed
};

export default function IncidentReport() {
  const { addIncident } = useIncidents();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [lga, setLGA] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !state || !lga) {
      alert("Please fill in Title, State, and LGA");
      return;
    }
    addIncident({
      id: Date.now(),
      title,
      description,
      state,
      lga,
      address,
      user: "Anonymous",
      location: null, // optional: add GPS location if available
    });
    // reset form
    setTitle("");
    setDescription("");
    setState("");
    setLGA("");
    setAddress("");
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "auto",
        padding: 16,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3 style={{ color: "#066c4a", marginBottom: 16 }}>Add Incident</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setLGA(""); // reset LGA when state changes
          }}
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">Select State</option>
          {Object.keys(statesAndLGAs).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <select
          value={lga}
          onChange={(e) => setLGA(e.target.value)}
          required
          disabled={!state}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">{state ? "Select LGA" : "Select State first"}</option>
          {state &&
            statesAndLGAs[state].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            padding: 10,
            backgroundColor: "#28a745", // green for Add Incident
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
