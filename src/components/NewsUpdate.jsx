import React, { useState } from "react";
import { db, saveDB } from "../db";
import NewsLogo from "../assets/NewsUpdate.png"; // ✅ new logo

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

function NewsUpdate({ user }) {
  const [news, setNews] = useState({ title: "", description: "", link: "", file: null });
  const [loading, setLoading] = useState(false);

  function addNews() {
    db.news.push({ id: Date.now().toString(), ...news });
    saveDB(db);
    setNews({ title: "", description: "", link: "", file: null });
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
      setNews({ ...news, file: data.secure_url });
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
        <img src={NewsLogo} alt="News Update" style={{ width: "120px" }} />
      </div>

      <input
        placeholder="Title"
        value={news.title}
        onChange={(e) => setNews({ ...news, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <textarea
        placeholder="Description"
        value={news.description}
        onChange={(e) => setNews({ ...news, description: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        placeholder="Link (optional)"
        value={news.link}
        onChange={(e) => setNews({ ...news, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input type="file" onChange={handleFileChange} style={{ width: "100%", marginBottom: "10px" }} />
      {loading && <p>Uploading image...</p>}
      {news.file && <img src={news.file} alt="News" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}

      <button
        onClick={addNews}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#006400",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Update
      </button>

      <h3 style={{ marginTop: "20px", textAlign: "center" }}>News Feed</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {db.news.map((n) => (
          <li
            key={n.id}
            style={{
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            <strong>{n.title}</strong>
            <br />
            {n.description}
            <br />
            {n.link && (
              <a href={n.link} target="_blank" rel="noreferrer">
                {n.link}
              </a>
            )}
            <br />
            {n.file && <img src={n.file} alt="News" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsUpdate;
