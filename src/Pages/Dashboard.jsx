import React from "react";
import { Link } from "react-router-dom";
import IncidentLogo from "../assets/IncidentReporting.png";
import AdsLogo from "../assets/Ads.png";
import CommunityLogo from "../assets/Community.png";
import EventLogo from "../assets/Event.png";
import NewsLogo from "../assets/NewsUpdate.png";

function Dashboard() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "50px" }}>
      <Link to="/incidents"><img src={IncidentLogo} alt="Incidents" style={{ height: "80px" }} /></Link>
      <Link to="/ads"><img src={AdsLogo} alt="Ads" style={{ height: "80px" }} /></Link>
      <Link to="/community"><img src={CommunityLogo} alt="Community" style={{ height: "80px" }} /></Link>
      <Link to="/events"><img src={EventLogo} alt="Events" style={{ height: "80px" }} /></Link>
      <Link to="/news"><img src={NewsLogo} alt="News" style={{ height: "80px" }} /></Link>
    </div>
  );
}

export default Dashboard;
