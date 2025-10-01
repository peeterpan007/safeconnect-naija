import React, { createContext, useContext, useState } from "react";

const IncidentContext = createContext();

export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);

  const addIncident = (incident) => {
    setIncidents((prev) => [...prev, incident]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents() {
  return useContext(IncidentContext);
}
