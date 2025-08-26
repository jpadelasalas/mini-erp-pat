import { createContext, useContext } from "react";

const SetupContext = createContext();

export const SetupContextProvider = ({ children }) => {
  return <SetupContext.Provider value={{}}>{children}</SetupContext.Provider>;
};

export const useSetup = () => useContext(SetupContext);
