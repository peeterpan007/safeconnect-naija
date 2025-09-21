import React, { useState } from "react";
import { db, saveDB } from "../db";
import EventLogo from "../assets/Event.png";
import PaymentModal from "./PaymentModal";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dohv7zysm/upload";
const UPLOAD_PRESET = "your_upload_preset";

function LocalEventsAndBusiness({ user }) {
  const [item, setItem] = useState({ title: "", link: "", file: null, category: "" });
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const CHARGE_AMOUNT = 10000; // Sample charge for Local Events & Business

  function addItem() {
    // Show payment modal first
    setShowPayment(true);
  }

  const handlePaymentConfirm = () => {
    db.localEvents.push({ id: Date.now().toString(), ...item });
    saveDB(db);
    setItem({ title: "", link: "", file: null, category: "" });
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

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
      setItem({ ...item, file: data.secure_url });
    } catch (err) {
      console.error("Error uploading to Cloudinary:", err);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img src={EventLogo} alt="Local Events & Business" style={{ width: "120px" }} />
      </div>

      <input
        placeholder="Title"
        value={item.title}
        onChange={(e) => setItem({ ...item, title: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />
      <input
        placeholder="Link"
        value={item.link}
        onChange={(e) => setItem({ ...item, link: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <select
        value={item.category}
        onChange={(e) => setItem({ ...item, category: e.target.value })}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="">Select Category</option>
        <option>Restaurants</option>
        <option>Bars</option>
        <option>Clubs</option>
        <option>Kids Day Out</option>
        <option>Other</option>
      </select>

      <input type="file" onChange={handleFileChange} style={{ width: "100%", marginBottom: "10px" }} />
      {loading && <p>Uploading image...</p>}
      {item.file && <img src={item.file} alt="Uploaded" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}

      <button
        onClick={addItem}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#0816b3",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Item
      </button>

      <h3 style={{ marginTop: "20px", textAlign: "center" }}>Local Events & Business</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {db.localEvents.map((i) => (
          <li
            key={i.id}
            style={{
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid #eee",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            <strong>{i.title}</strong> ({i.category})
            <br />
            {i.link && (
              <a href={i.link} target="_blank" rel="noreferrer">
                {i.link}
              </a>
            )}
            <br />
            {i.file && <img src={i.file} alt="Uploaded" style={{ width: "100px", marginTop: "5px", borderRadius: "4px" }} />}
          </li>
        ))}
      </ul>

      {showPayment && (
        <PaymentModal
          amount={CHARGE_AMOUNT}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  );
}

export default LocalEventsAndBusiness;
