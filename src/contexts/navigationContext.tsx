import { createContext, useState, ReactNode } from "react";

interface NavContextType {
  activeView: string;
  setActiveView: (activeView:string) => void;
  activeMenuItem: string;
  setActiveMenuItem: (activeMenuItem:string) => void;
  activeSubMenuItem: string;
  setActiveSubMenuItem: (activeSubMenuItem:string) => void;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export const navContext = createContext<NavContextType>({
  activeView: 'dashboard',
  setActiveView: () => {},
  activeMenuItem: 'default',
  setActiveMenuItem: () => {},
  activeSubMenuItem: 'e-commerce',
  setActiveSubMenuItem: () => {}
});

const NavigationProvider = ({ children }:NavigationProviderProps) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [activeMenuItem, setActiveMenuItem] = useState("default");
  const [activeSubMenuItem, setActiveSubMenuItem] = useState("e-commerce");

  return (
    <navContext.Provider value={{ 
      activeView, 
      setActiveView,
      activeMenuItem,
      setActiveMenuItem,
      activeSubMenuItem,
      setActiveSubMenuItem
    }}>
      {children}
    </navContext.Provider>
  );
};

export default NavigationProvider;
