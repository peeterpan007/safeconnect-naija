import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      navigate("/incidents"); // Redirect after login
    } else {
      alert("Enter username and password");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: "10px", padding: "8px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "8px" }}
      />
      <br />
      <button onClick={handleLogin} style={{ padding: "10px 20px" }}>Login</button>
    </div>
  );
}

export default Login;
