// src/components/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, uid, guest }

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("safeConnectUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("safeConnectUser", JSON.stringify(user));
    else localStorage.removeItem("safeConnectUser");
  }, [user]);

  const login = (userData) => {
    // userData: { name, email, uid } — add guest:false
    setUser({ ...userData, guest: false });
  };

  const continueAsGuest = () => {
    setUser({ name: "Guest", guest: true });
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, continueAsGuest }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
