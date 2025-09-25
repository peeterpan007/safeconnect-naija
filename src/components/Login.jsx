import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      // Replace with Firebase email/password sign-in if you want real auth
      onLogin?.({ email });
    } else {
      alert("Please enter both email and password");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin?.({ email: user.email, name: user.displayName });
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
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
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
