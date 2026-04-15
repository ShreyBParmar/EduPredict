import React, { createContext, useContext, useState } from "react";

// Create context
const SubjectContext = createContext();

// Provider
export const SubjectProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState("");

  return (
    <SubjectContext.Provider value={{ selectedSubject, setSelectedSubject }}>
      {children}
    </SubjectContext.Provider>
  );
};

// Custom hook (clean usage)
export const useSubject = () => useContext(SubjectContext);