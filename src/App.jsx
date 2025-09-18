import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import IncidentReports from "./components/IncidentReports";
import Ads from "./components/Ads";
import CommunityConnect from "./components/CommunityConnect";
import LocalEventsBusiness from "./components/LocalEventsBusiness";
import NewsUpdate from "./components/NewsUpdates";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />   {/* Home + login */}
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/incidents" element={<IncidentReports />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/community" element={<CommunityConnect />} />
        <Route path="/events" element={<LocalEventsBusiness />} />
        <Route path="/news" element={<NewsUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;
