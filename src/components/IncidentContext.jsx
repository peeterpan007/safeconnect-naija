// src/components/IncidentContext.jsx
import React, { createContext, useState, useContext } from "react";

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);

  const addIncident = (incident) => {
    setIncidents((prev) => [...prev, incident]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => useContext(IncidentContext);
