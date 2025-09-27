import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";
import LocationDetails from "./pages/LocationDetails";
import { config, chains } from './wagmi';
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const handleLogout = () => {
    console.log("setting auth token to null");
    setAuthToken(null); // Clear the authToken
  };
  
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout}/>} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/location/:name" element={<LocationDetails />} />
            </Routes>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
};
// element={authToken ? <HomePage authToken={authToken} handleLogout={handleLogout}/> : <Navigate to="/" />} />
export default App;
