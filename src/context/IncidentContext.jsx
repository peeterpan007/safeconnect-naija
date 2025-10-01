import React, { createContext, useState, useContext } from "react";

// Create context
const IncidentContext = createContext();

// Provider
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

// Custom hook for easy access
export const useIncidents = () => useContext(IncidentContext);
