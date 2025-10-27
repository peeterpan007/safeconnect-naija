// src/components/IncidentContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// Create the global IncidentContext
const IncidentContext = createContext();

/**
 * IncidentProvider
 * Wraps your app and gives access to incident data + methods
 * across all components (IncidentReports, IncidentMap, etc.)
 */
export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);

  // 🔹 Load incidents from localStorage on mount
  useEffect(() => {
    try {
      const savedIncidents = localStorage.getItem("safeConnectIncidents");
      if (savedIncidents) {
        setIncidents(JSON.parse(savedIncidents));
      }
    } catch (error) {
      console.error("Failed to load incidents from localStorage:", error);
    }
  }, []);

  // 🔹 Persist incidents to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem("safeConnectIncidents", JSON.stringify(incidents));
    } catch (error) {
      console.error("Failed to save incidents:", error);
    }
  }, [incidents]);

  // 🔹 Add a new incident
  const addIncident = (incident) => {
    // Ensure incident is an object before adding
    if (incident && typeof incident === "object") {
      setIncidents((prev) => [...prev, incident]);
    } else {
      console.warn("Invalid incident data:", incident);
    }
  };

  // 🔹 Context value shared across components
  const contextValue = {
    incidents,
    addIncident,
  };

  return (
    <IncidentContext.Provider value={contextValue}>
      {children}
    </IncidentContext.Provider>
  );
};

/**
 * useIncident — custom hook for components
 * Example:
 *   const { incidents, addIncident } = useIncident();
 */
export const useIncident = () => useContext(IncidentContext);
