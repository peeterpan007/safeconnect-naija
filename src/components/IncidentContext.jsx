// src/components/IncidentContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const IncidentContext = createContext();

// Provider component
export function IncidentProvider({ children }) {
  const [incidents, setIncidents] = useState([]);

  // Load from localStorage if exists
  useEffect(() => {
    const stored = localStorage.getItem("incidents");
    if (stored) {
      setIncidents(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever incidents change
  useEffect(() => {
    localStorage.setItem("incidents", JSON.stringify(incidents));
  }, [incidents]);

  // Add a new incident
  const addIncident = (incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  // Context value
  const value = {
    incidents,
    addIncident,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

// Custom hook for easier usage
export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error(
      "useIncidents must be used within an IncidentProvider"
    );
  }
  return context;
}
