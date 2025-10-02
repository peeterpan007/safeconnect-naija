// src/components/Login.jsx
import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUser } from "./UserContext";

/**
 * Props:
 *  - onLogin?: optional callback (userData) => {} — App may pass this to set local UI state
 *
 * This component uses Firebase Auth for Google/Facebook and email/password. It will call
 * context.login(userData) if available, and also call onLogin prop if provided.
 */
export default function Login({ onLogin }) {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email/password
  const handleEmailLogin = async (e) => {
    e?.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const userData = { name: user.displayName || user.email, email: user.email, uid: user.uid };
      login?.(userData);
      onLogin?.(userData);
    } catch (err) {
      console.error(err);
      alert("Email login failed. Check credentials.");
    }
  };

  // Google
  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const u = res.user;
      const userData = { name: u.displayName || u.email, email: u.email, uid: u.uid };
      login?.(userData);
      onLogin?.(userData);
    } catch (err) {
      console.error(err);
      alert("Google sign-in failed. Check Firebase console and provider settings.");
    }
  };

  // Facebook
  const handleFacebook = async () => {
    try {
      const res = await signInWithPopup(auth, facebookProvider);
      const u = res.user;
      const userData = { name: u.displayName || u.email, email: u.email, uid: u.uid };
      login?.(userData);
      onLogin?.(userData);
    } catch (err) {
      console.error(err);
      alert("Facebook sign-in failed. Check Facebook app and Firebase settings.");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <form onSubmit={handleEmailLogin} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: 10, background: "#066c4a", color: "#fff", border: "none", borderRadius: 6 }}>
          Log in
        </button>
      </form>

      <hr style={{ margin: "12px 0" }} />

      <button onClick={handleGoogle} style={{ width: "100%", padding: 10, background: "#db4437", color: "#fff", border: "none", borderRadius: 6 }}>
        Continue with Google
      </button>

      <button onClick={handleFacebook} style={{ width: "100%", marginTop: 8, padding: 10, background: "#3b5998", color: "#fff", border: "none", borderRadius: 6 }}>
        Continue with Facebook
      </button>
    </div>
  );
}
