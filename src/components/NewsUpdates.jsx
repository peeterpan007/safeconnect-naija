import React, { useState } from "react";
import { db, saveDB } from "../db";
import { Newspaper } from "lucide-react"; // ✅ Lucide icon

function NewsUpdate({ user }) {
  const [news, setNews] = useState({ title: "", description: "", link: "" });

  function addNews() {
    db.news.push({ id: Date.now().toString(), ...news });
    saveDB(db);
    setNews({ title: "", description: "", link: "" });
  }

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header with icon */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <Newspaper size={50} color="#facc15" style={{ marginBottom: "10px" }} />
        <h2 style={{ fontSize: "22px", margin: 0, color: "#333" }}>News Update</h2>
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

      <button
        onClick={addNews}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#1e90ff",
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsUpdate;
