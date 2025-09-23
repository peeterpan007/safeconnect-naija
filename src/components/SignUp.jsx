import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function SignUp({ onSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      onSignUp?.({ name, email });
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      onSignUp?.({ name: result.user.displayName, email: result.user.email });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook user:", result.user);
      onSignUp?.({ name: result.user.displayName, email: result.user.email });
    } catch (error) {
      console.error(error);
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
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
