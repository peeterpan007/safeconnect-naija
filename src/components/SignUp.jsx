// src/components/SignUp.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useUser } from "./UserContext";

/**
 * Props:
 *  - onSignUp?: optional callback(userData)
 */
export default function SignUp({ onSignUp }) {
  const { login } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e?.preventDefault();
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred?.user) {
        await updateProfile(cred.user, { displayName: name });
        const userData = { name: name || cred.user.displayName || email, email: cred.user.email, uid: cred.user.uid };
        login?.(userData);
        onSignUp?.(userData);
      }
    } catch (err) {
      console.error(err);
      alert("Sign up failed. Check Firebase console and try again.");
    }
  };

  return (
    <form onSubmit={handleSignUp} style={{ maxWidth: 420, margin: "0 auto", display: "grid", gap: 8 }}>
      <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={sharedInput} />
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={sharedInput} required />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={sharedInput} required />
      <button type="submit" style={{ padding: 10, background: "#066c4a", color: "#fff", border: "none", borderRadius: 6 }}>
        Create account
      </button>
    </form>
  );
}

const sharedInput = { padding: 8, borderRadius: 6, border: "1px solid #ccc" };
