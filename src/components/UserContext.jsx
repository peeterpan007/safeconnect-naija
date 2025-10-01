import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores user info
  const [guest, setGuest] = useState(false);

  // login after Google/Facebook/Phone/SignUp
  const login = (userData) => {
    setUser(userData);
    setGuest(false);
  };

  // guest access
  const continueAsGuest = () => {
    setUser({ name: "Guest" }); // minimal guest object
    setGuest(true);
  };

  const logout = () => {
    setUser(null);
    setGuest(false);
  };

  return (
    <UserContext.Provider value={{ user, guest, login, continueAsGuest, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
