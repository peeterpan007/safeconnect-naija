// src/components/PhoneLogin.jsx
import React, { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "./UserContext";

/**
 * PhoneLogin:
 * Props:
 *  - onVerify?: optional callback(userData)
 *
 * NOTE: For phone sign-in to work on web:
 *  - You must enable Phone sign-in in Firebase Console.
 *  - You must configure Authorized domains (your domain).
 *  - Firebase will need reCAPTCHA (this component creates an invisible reCAPTCHA).
 */
export default function PhoneLogin({ onVerify }) {
  const { login } = useUser();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(false);
  const [stage, setStage] = useState("inputPhone"); // inputPhone -> inputCode

  useEffect(() => {
    // Ensure recaptcha is available
    if (!recaptchaRef.current) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
      recaptchaRef.current = true;
    }
    // cleanup: don't remove recaptcha on unmount; firebase handles it
  }, []);

  const sendCode = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      confirmationRef.current = confirmation;
      setStage("inputCode");
      alert("OTP sent to phone. Enter the code.");
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP. Make sure the phone number is in E.164 format (e.g. +2348012345678) and phone auth is enabled.");
    }
  };

  const verifyCode = async () => {
    try {
      const confirmation = confirmationRef.current;
      if (!confirmation) {
        alert("No confirmation object found. Request a new OTP.");
        return;
      }
      const res = await confirmation.confirm(code);
      const u = res.user;
      const userData = { name: u.displayName || u.phoneNumber, email: u.email || null, uid: u.uid };
      login?.(userData);
      onVerify?.(userData);
    } catch (err) {
      console.error(err);
      alert("Invalid code or verification failed.");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", display: "grid", gap: 8 }}>
      <div id="recaptcha-container" />

      {stage === "inputPhone" && (
        <>
          <input placeholder="+2348012345678" value={phone} onChange={(e) => setPhone(e.target.value)} style={sharedInput} />
          <button onClick={sendCode} style={btnPrimary}>Send OTP</button>
        </>
      )}

      {stage === "inputCode" && (
        <>
          <input placeholder="Enter OTP code" value={code} onChange={(e) => setCode(e.target.value)} style={sharedInput} />
          <button onClick={verifyCode} style={btnPrimary}>Verify code</button>
        </>
      )}
    </div>
  );
}

const sharedInput = { padding: 8, borderRadius: 6, border: "1px solid #ccc" };
const btnPrimary = { padding: 10, background: "#066c4a", color: "#fff", border: "none", borderRadius: 6 };
