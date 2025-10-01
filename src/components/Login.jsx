import React from "react";
import { auth, googleProvider, facebookProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Login({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin({ name: result.user.displayName, email: result.user.email });
    } catch (err) {
      console.error(err);
      alert("Google login failed.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      onLogin({ name: result.user.displayName, email: result.user.email });
    } catch (err) {
      console.error(err);
      alert("Facebook login failed.");
    }
  };

  return (
    <div>
      {/* Existing email/password login form here */}

      <button
        onClick={handleGoogleLogin}
        style={{ margin: "10px", background: "#db4a39", color: "white" }}
      >
        Continue with Google
      </button>

      <button
        onClick={handleFacebookLogin}
        style={{ margin: "10px", background: "#3b5998", color: "white" }}
      >
        Continue with Facebook
      </button>
    </div>
  );
}

export default Login;
