import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SelfQRcodeWrapper, SelfAppBuilder, countries } from '@selfxyz/qrcode';

const LandingPage = ({ setAuthToken, authToken, handleLogout }) => {
  console.log("LoginPage component rendered: ", authToken);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [selfApp, setSelfApp] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  // Initialize Self App on component mount
  useEffect(() => {
    if (address) {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || 'RockToRoll',
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || 'rock-to-roll',
        endpoint: "0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74",
        logoBase64: 'https://i.postimg.cc/mrmVf9hm/self.png',
        userId: address,
        endpointType: 'celo',
        userIdType: 'hex',
        userDefinedData: 'Rock To Roll App Verification',
        disclosures: {
          minimumAge: 18,
          excludedCountries: [countries.CUBA, countries.IRAN, countries.NORTH_KOREA, countries.RUSSIA],
          nationality: true,
          gender: true,
        },
      }).build();
      console.log("Details", app)
      setSelfApp(app);

    }
  }, [address]);

  // Wrap handleWalletConnect in useCallback to avoid changing reference on every render
  const handleWalletConnect = useCallback(async () => {
    if (isConnected && address) {
      setAuthToken(address);
      localStorage.setItem("authToken", address);
      localStorage.setItem("address", address);
    }
  }, [isConnected, address, setAuthToken]);

  const onLogoutClick = () => {
    disconnect();
    handleLogout();
    setIsVerified(false); // Reset verification status on logout
    navigate("/");
  };

  const handleSuccessfulVerification = useCallback(() => {
    console.log('Verified!');
    setIsVerified(true);
    navigate("/events");
  }, [navigate]);

  // Auto-navigate when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      handleWalletConnect();
    }
  }, [isConnected, address, handleWalletConnect]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/videos/opener.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#F44336] via-[#ccd8f3] to-[#EF5350] text-shadow-lg">
          Rock To Roll
        </h1>
        <p className="text-lg md:text-xl font-semibold opacity-90 text-gray-800">
          Stay Bullish, Play Stylish!
        </p>

        {!authToken ? (
          <div className="mt-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#F44336] via-[#ccd8f3] to-[#EF5350] text-white text-lg font-semibold rounded-xl shadow-xl px-8 py-4 transform transition duration-200 ease-in-out hover:scale-105">
              <ConnectButton 
                label="Connect Wallet"
                showBalance={false}
                chainStatus="none"
                accountStatus="address"
              />
            </div>
          </div>
        ) : (
          !isVerified ? (
            <div className="mt-8">
              {selfApp ? (
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccessfulVerification}
                  onError={() => {
                    console.error('Error: Failed to verify identity');
                  }}
                />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <button
                onClick={onLogoutClick}
                className="explore bg-black text-white px-6 py-3 text-xl font-semibold rounded-xl shadow-xl transition duration-200 ease-in-out hover:bg-gray-800 hover:scale-105"
              >
                Logout
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LandingPage;