import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function SignUp({ onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name });
      }

      onSignUp?.({ name: user.displayName || name, email: user.email });
    } catch (error) {
      console.error(error);
      alert("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider, type) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onSignUp?.({ name: user.displayName, email: user.email });
    } catch (error) {
      console.error(error);
      alert(`${type} sign-up failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <hr />

      <button
        onClick={() => handleSocialSignUp(googleProvider, "Google")}
        className="google-btn"
        disabled={loading}
      >
        Sign up with Google
      </button>
      <button
        onClick={() => handleSocialSignUp(facebookProvider, "Facebook")}
        className="facebook-btn"
        disabled={loading}
      >
        Sign up with Facebook
      </button>
    </div>
  );
}

export default SignUp;
