import React, { useState } from "react";
import { db, saveDB } from "../db";
import AdsLogo from "../assets/Ads.png"; // ✅ new logo

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

function Ads({ user }) {
  const [ad, setAd] = useState({ title: "", link: "", file: null });
  const [loading, setLoading] = useState(false);

  function createAd() {
    db.ads.push({ id: Date.now().toString(), clicks: 0, impressions: 0, ...ad });
    saveDB(db);
    setAd({ title: "", link: "", file: null });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      const data = await res.json();
      setAd({ ...ad, file: data.secure_url });
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      {/* Logo Header */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img src={AdsLogo} alt="Ads" style={{ width: "120px" }} />
      </div>

      {/* Form Inputs */}
      <input
        placeholder="Ad Title"
        value={ad.title}
        onChange={(e) => setAd({ ...ad, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        placeholder="Ad Link"
        value={ad.link}
        onChange={(e) => setAd({ ...ad, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input type="file" onChange={handleFileChange} style={{ width: "100%", marginBottom: "10px" }} />
      {loading && <p>Uploading image...</p>}
      {ad.file && <img src={ad.file} alt="Uploaded" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}

      <button
        onClick={createAd}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1e53ff",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Create Ad
      </button>

      {/* Existing Ads */}
      <h3 style={{ marginTop: "20px", textAlign: "center" }}>Created Ads</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {db.ads.map((a) => (
          <li
            key={a.id}
            style={{
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            <strong>{a.title}</strong>
            <br />
            {a.link && (
              <a href={a.link} target="_blank" rel="noreferrer">
                {a.link}
              </a>
            )}
            <br />
            {a.file && <img src={a.file} alt="" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ads;
