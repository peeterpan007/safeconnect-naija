import React, { useState } from "react";
import { db, saveDB } from "../db";

function CommunityConnect({ user }) {
  const [post, setPost] = useState({ text: "", file: null, link: "" });

  function addPost() {
    db.community.push({ id: Date.now().toString(), ...post });
    saveDB(db);
    setPost({ text: "", file: null, link: "" });
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPost({ ...post, file: reader.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ marginBottom: "20px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h2>Community Connect</h2>

      <textarea
        placeholder="Share your opinion"
        value={post.text}
        onChange={e => setPost({ ...post, text: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Add link"
        value={post.link}
        onChange={e => setPost({ ...post, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="file"
        onChange={handleFileChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button
        onClick={addPost}
        style={{ width: "100%", padding: "10px", backgroundColor: "#1e90ff", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Post
      </button>

      <h3 style={{ marginTop: "20px" }}>Community Posts</h3>
      <ul>
        {db.community.map(c => (
          <li key={c.id} style={{ marginBottom: "10px", padding: "8px", border: "1px solid #eee", borderRadius: "5px" }}>
            {c.text}<br/>
            {c.link && <a href={c.link} target="_blank" rel="noreferrer">{c.link}</a>}<br/>
            {c.file && <img src={c.file} alt="" style={{ width: "100px", display: "block", marginTop: "5px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommunityConnect;
