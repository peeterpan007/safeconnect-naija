import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin?.({ email: user.email, name: user.displayName || "User" });
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider, type) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin?.({ email: user.email, name: user.displayName });
    } catch (error) {
      console.error(error);
      alert(`${type} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <hr />

      <button
        onClick={() => handleSocialLogin(googleProvider, "Google")}
        className="google-btn"
        disabled={loading}
      >
        Continue with Google
      </button>
      <button
        onClick={() => handleSocialLogin(facebookProvider, "Facebook")}
        className="facebook-btn"
        disabled={loading}
      >
        Continue with Facebook
      </button>
    </div>
  );
}

export default Login;
