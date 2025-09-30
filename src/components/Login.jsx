import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Email/Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLogin?.({ email: user.email, name: user.displayName || "User" });
    } catch (error) {
      console.error(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLogin?.({ email: user.email, name: user.displayName });
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  // Handle Facebook login
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      onLogin?.({ email: user.email, name: user.displayName });
    } catch (error) {
      console.error(error);
      alert("Facebook login failed");
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
        <button type="submit">Login</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin} className="google-btn">
        Continue with Google
      </button>
      <button onClick={handleFacebookLogin} className="facebook-btn">
        Continue with Facebook
      </button>
    </div>
  );
}

export default Login;
