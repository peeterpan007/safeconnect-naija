// src/components/IncidentContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// IncidentContext: store incidents globally and persist to localStorage
const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("safeConnectIncidents");
      if (raw) setIncidents(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("safeConnectIncidents", JSON.stringify(incidents));
    } catch {}
  }, [incidents]);

  const addIncident = (incident) => {
    // incident should be an object; we append and persist
    setIncidents((prev) => [...prev, incident]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => useContext(IncidentContext);
