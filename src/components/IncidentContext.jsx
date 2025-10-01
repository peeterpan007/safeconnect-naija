import React, { createContext, useContext, useState } from "react";
import { db, saveDB } from "../db";

const IncidentContext = createContext();

export const useIncidents = () => useContext(IncidentContext);

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState(db.incidents || []);

  const addIncident = (incident) => {
    const finalIncident = { id: Date.now().toString(), ...incident };
    db.incidents.push(finalIncident);
    saveDB(db);
    setIncidents([...db.incidents]);
  };

  return (
    <IncidentContext.Provider value={{ incidents, addIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};
