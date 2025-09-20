import React, { useState } from "react";
import logo from "../assets/Connect4.jpg";

export default function Home({ setUser }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = () => {
    if (!form.username || !form.password) return alert("Please enter username and password");
    setUser({ id: Date.now().toString(), username: form.username });
    alert(`Logged in as ${form.username}`);
  };

  const handleSignUp = () => {
    if (!form.username || !form.password || !form.confirmPassword) return alert("All fields required");
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");
    setUser({ id: Date.now().toString(), username: form.username });
    alert(`Account created for ${form.username}`);
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Logo and Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src={logo} alt="SafeConnectNaija Logo" style={{ width: "150px", borderRadius: "6px" }} />
        <h1 style={{ margin: "10px 0", fontSize: "24px", color: "#311eff" }}>SafeConnect Naija</h1>
        <p style={{ color: "#555" }}>Building safer, stronger communities across Nigeria</p>
      </div>

      {/* Toggle Login / Sign Up */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, gap: 10 }}>
        <button onClick={() => setIsLogin(true)} style={{ padding: 10, backgroundColor: isLogin ? "#10b981" : "#ccc", color: "#fff", borderRadius: 6 }}>Login</button>
        <button onClick={() => setIsLogin(false)} style={{ padding: 10, backgroundColor: !isLogin ? "#10b981" : "#ccc", color: "#fff", borderRadius: 6 }}>Sign Up</button>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 300, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
        />
        {!isLogin && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
        )}
        <button
          onClick={isLogin ? handleLogin : handleSignUp}
          style={{ padding: 10, backgroundColor: "#311eff", color: "#fff", borderRadius: 6, fontWeight: "bold" }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </div>

      {/* Footer / CTA */}
      <div style={{ backgroundColor: "#0821c6", color: "#fff", padding: 20, borderRadius: 10, textAlign: "center", marginTop: 30 }}>
        <h2>Ready to make your neighborhood safer?</h2>
        <p>Join thousands of Nigerians already using SafeConnect to build stronger, safer communities.</p>
        <button style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "12px 25px", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>
          Join Your Community
        </button>
      </div>
    </div>
  );
}
