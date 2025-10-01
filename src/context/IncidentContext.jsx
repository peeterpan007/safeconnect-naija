import React, { createContext, useState, useContext } from "react";

const IncidentContext = createContext();

export function useIncident() {
  return useContext(IncidentContext);
}

export function IncidentProvider({ children }) {
  const [user, setUser] = useState(null); // { name: "John" } or null
  const [currentLocation, setCurrentLocation] = useState(null); // { latitude, longitude, address }
  const [tracking, setTracking] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const startTracking = () => setTracking(true);
  const stopTracking = () => setTracking(false);

  const addIncident = (incident) => {
    setIncidents((prev) => [...prev, incident]);
  };

  return (
    <IncidentContext.Provider
      value={{
        user,
        setUser,
        currentLocation,
        setCurrentLocation,
        tracking,
        startTracking,
        stopTracking,
        incidents,
        addIncident,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
}
