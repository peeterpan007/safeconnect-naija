import React, { createContext, useState, useContext } from "react";

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [user, setUser] = useState(null);

  const addIncident = (incident) => {
    setIncidents((prev) => [...prev, incident]);
    setCurrentIncident(incident);
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        currentIncident,
        addIncident,
        setCurrentIncident,
        user,
        setUser,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => useContext(IncidentContext);
