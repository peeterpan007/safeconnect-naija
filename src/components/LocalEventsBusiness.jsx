import React, { useState } from "react";
import { db, saveDB } from "../db";

function LocalEventsAndBusiness({ user }) {
  const [item, setItem] = useState({ title: "", link: "", file: null, category: "" });

  function addItem() {
    db.localEvents.push({ id: Date.now().toString(), ...item });
    saveDB(db);
    setItem({ title: "", link: "", file: null, category: "" });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setItem({ ...item, file: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h2>Local Events & Business</h2>

      <input
        placeholder="Title"
        value={item.title}
        onChange={e => setItem({ ...item, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Link"
        value={item.link}
        onChange={e => setItem({ ...item, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <select
        value={item.category}
        onChange={e => setItem({ ...item, category: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select Category</option>
        <option>Restaurants</option>
        <option>Bars</option>
        <option>Clubs</option>
        <option>Kids Day Out</option>
        <option>Other</option>
      </select>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button
        onClick={addItem}
        style={{ width: "100%", padding: "10px", backgroundColor: "#1e90ff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Add Item
      </button>

      <h3 style={{ marginTop: "20px" }}>Local Events & Business</h3>
      <ul>
        {db.localEvents.map(i => (
          <li key={i.id} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #eee", borderRadius: "5px" }}>
            <strong>{i.title}</strong> ({i.category})<br/>
            {i.link && <a href={i.link} target="_blank" rel="noreferrer">{i.link}</a>}<br/>
            {i.file && <img src={i.file} alt="" style={{ width: "100px", display: "block", marginTop: "5px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocalEventsAndBusiness;
