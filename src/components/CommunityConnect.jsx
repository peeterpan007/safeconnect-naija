import React, { useState } from "react";
import { db, saveDB } from "../db";
import { MessageCircle } from "lucide-react"; // ✅ Lucide icon

// Cloudinary unsigned upload settings
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset"; // replace with your Cloudinary preset

function CommunityConnect({ user }) {
  const [post, setPost] = useState({ text: "", file: null, link: "" });
  const [loading, setLoading] = useState(false);

  function addPost() {
    db.community.push({ id: Date.now().toString(), ...post });
    saveDB(db);
    setPost({ text: "", file: null, link: "" });
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPost({ ...post, file: data.secure_url });
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <MessageCircle size={50} color="#4ade80" style={{ marginBottom: "10px" }} />
        <h2 style={{ fontSize: "22px", margin: 0, color: "#333" }}>Community Connect</h2>
      </div>

      {/* Post Inputs */}
      <textarea
        placeholder="Share your opinion"
        value={post.text}
        onChange={(e) => setPost({ ...post, text: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Add link"
        value={post.link}
        onChange={(e) => setPost({ ...post, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {loading && <p>Uploading image...</p>}
      {post.file && (
        <img
          src={post.file}
          alt="Uploaded"
          style={{ width: "100px", display: "block", marginTop: "5px", borderRadius: "4px" }}
        />
      )}

      <button
        onClick={addPost}
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
        Post
      </button>

      {/* Existing Posts */}
      <h3 style={{ marginTop: "20px", textAlign: "center" }}>Community Posts</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {db.community.map((c) => (
          <li
            key={c.id}
            style={{
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            {c.text}
            <br />
            {c.link && (
              <a href={c.link} target="_blank" rel="noreferrer">
                {c.link}
              </a>
            )}
            <br />
            {c.file && (
              <img
                src={c.file}
                alt=""
                style={{ width: "100px", display: "block", marginTop: "5px", borderRadius: "4px" }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommunityConnect;
