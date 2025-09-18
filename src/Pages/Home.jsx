import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/SafeConnect.png";

function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <img src={Logo} alt="SafeConnect Logo" style={{ width: "150px", marginBottom: "20px" }} />
      <h1>Welcome to SafeConnect Naija</h1>
      <p>Building safer, stronger communities across Nigeria.</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
        </Link>
        <Link to="/contact">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Contact Us</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
