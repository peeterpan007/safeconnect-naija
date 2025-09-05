import React, { useState } from "react";
import { db, saveDB } from "../db";

function Ads({ user }) {
  const [ad, setAd] = useState({ title: "", link: "", file: null });

  function createAd() {
    db.ads.push({ id: Date.now().toString(), clicks: 0, impressions: 0, ...ad });
    saveDB(db);
    setAd({ title: "", link: "", file: null });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAd({ ...ad, file: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h2>Ads</h2>

      <input
        placeholder="Ad Title"
        value={ad.title}
        onChange={e => setAd({ ...ad, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Ad Link"
        value={ad.link}
        onChange={e => setAd({ ...ad, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button
        onClick={createAd}
        style={{ width: "100%", padding: "10px", backgroundColor: "#1e90ff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Create Ad
      </button>

      <h3 style={{ marginTop: "20px" }}>Created Ads</h3>
      <ul>
        {db.ads.map(a => (
          <li key={a.id} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #eee", borderRadius: "5px" }}>
            <strong>{a.title}</strong><br/>
            {a.link && <a href={a.link} target="_blank" rel="noreferrer">{a.link}</a>}<br/>
            {a.file && <img src={a.file} alt="" style={{ width: "100px", display: "block", marginTop: "5px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ads;
