import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

function SignUp({ onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Email/Password Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update displayName if provided
      if (name) {
        await user.updateProfile({ displayName: name });
      }

      onSignUp?.({ name: user.displayName || name, email: user.email });
    } catch (error) {
      console.error(error);
      alert("Sign-up failed. Please try again.");
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onSignUp?.({ name: user.displayName, email: user.email });
    } catch (error) {
      console.error(error);
      alert("Google sign-up failed");
    }
  };

  // Handle Facebook Sign Up
  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      onSignUp?.({ name: user.displayName, email: user.email });
    } catch (error) {
      console.error(error);
      alert("Facebook sign-up failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
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
      <button type="submit">Sign Up</button>

      {/* Social sign up buttons */}
      <div className="social-signup">
        <button type="button" onClick={handleGoogleSignUp} className="google-btn">
          Sign up with Google
        </button>
        <button type="button" onClick={handleFacebookSignUp} className="facebook-btn">
          Sign up with Facebook
        </button>
      </div>
    </form>
  );
}

export default SignUp;
