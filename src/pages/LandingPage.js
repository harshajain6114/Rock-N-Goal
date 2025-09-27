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
    <div className="min-h-screen relative overflow-hidden text-foreground bg-[#0a1512]">
      {/* Video Background with overlay */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
        autoPlay
        loop
        muted
      >
        <source src="/videos/opener.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Parallax Layer 1: Monopoly board grid (farthest) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(18,58,46,0.8) 0 2px, transparent 2px 96px), repeating-linear-gradient(90deg, rgba(18,58,46,0.8) 0 2px, transparent 2px 96px)",
          backgroundSize: "auto",
          transform: "scale(1.2) rotate(-1deg)",
          opacity: 0.25,
        }}
      />

      {/* Parallax Layer 3: Neon pixel rain (closest) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(0,255,204,0.06), transparent 40%), repeating-linear-gradient(180deg, rgba(0,255,204,0.12) 0 1px, transparent 1px 4px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-8 px-4 sm:px-6 lg:px-10">
        {/* Main Title */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-widest mb-4"
          style={{
            fontFamily: "'Press Start 2P', ui-monospace, monospace",
            textShadow: "0 0 6px #12ffd7, 0 0 18px rgba(18,255,215,0.4)",
            color: "#d6f7ee",
          }}
        >
          ROCK TO ROLL
        </h1>
        
        {/* Subtitle */}
        <p
          className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8"
          style={{
            fontFamily: "'Press Start 2P', ui-monospace, monospace",
            color: "#7fe9cf",
            textShadow: "0 0 4px rgba(18,255,215,0.3)",
          }}
        >
          
        </p>

        {/* Main Content Card */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="rounded-lg p-8 relative overflow-hidden pixel-frame pixel-frame-active"
            style={{
              background: "linear-gradient(180deg, rgba(6,28,22,0.95), rgba(4,18,15,0.98))",
            }}
          >
            {!authToken ? (
              <div className="space-y-6">
                <h2
                  className="text-lg font-black mb-6"
                  style={{
                    fontFamily: "'Press Start 2P', ui-monospace, monospace",
                    color: "#e7fdf7",
                    textShadow: "0 0 4px rgba(18,255,215,0.2)",
                  }}
                >
                  CONNECT WALLET
                </h2>
                
                <div className="pixel-button-wrapper">
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
                <div className="space-y-6 bg-green-800">
                  <h2
                    className="text-lg font-black mb-4"
                    style={{
                      fontFamily: "'Press Start 2P', ui-monospace, monospace",
                      color: "#e7fdf7",
                      textShadow: "0 0 4px rgba(18,255,215,0.2)",
                    }}
                  >
                    VERIFY IDENTITY WITH SELF
                  </h2>
                  
                  <p
                    className="text-xs mb-6 leading-relaxed"
                    style={{
                      fontFamily: "'Press Start 2P', ui-monospace, monospace",
                      color: "#7fe9cf",
                      textShadow: "0 0 4px rgba(18,255,215,0.3)",
                      opacity: 0.9,
                    }}
                  >
                    {"PROVE YOU'RE NOT A BOT"}
                    <br />
                    <span style={{ color: "#9ddfd0", fontSize: "10px" }}>
                      {"SCAN • VERIFY • ROLL"}
                    </span>
                  </p>
                  
                  {selfApp ? (
                    <div className="qr-wrapper ">
                      <SelfQRcodeWrapper
                        selfApp={selfApp}
                        onSuccess={handleSuccessfulVerification}
                        onError={() => {
                          console.error('Error: Failed to verify identity');
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="py-4 text-center"
                      style={{
                        fontFamily: "'Press Start 2P', ui-monospace, monospace",
                        color: "#7fe9cf",
                        fontSize: "12px",
                      }}
                    >
                      Loading QR Code...
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h2
                    className="text-lg font-black mb-6"
                    style={{
                      fontFamily: "'Press Start 2P', ui-monospace, monospace",
                      color: "#e7fdf7",
                      textShadow: "0 0 4px rgba(18,255,215,0.2)",
                    }}
                  >
                    VERIFIED
                  </h2>
                  
                  <button
                    onClick={onLogoutClick}
                    className="w-full py-3 rounded-sm pixel-button"
                    style={{
                      fontFamily: "'Press Start 2P', ui-monospace, monospace",
                    }}
                  >
                    LOGOUT
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Local styles for pixel/animation (scoped to this component) */}
      <style>{`
        @keyframes slowPan {
          0% { transform: translate3d(0,0,0) scale(1.05); }
          100% { transform: translate3d(-4%, -2%, 0) scale(1.05); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 
              0 0 0 2px rgba(18,255,215,0.35),
              0 0 0 6px rgba(6,35,28,0.9),
              0 0 0 8px rgba(18,255,215,0.25),
              0 0 20px rgba(18,255,215,0.2);
          }
          50% { 
            box-shadow: 
              0 0 0 2px rgba(18,255,215,0.5),
              0 0 0 6px rgba(6,35,28,0.9),
              0 0 0 8px rgba(18,255,215,0.4),
              0 0 30px rgba(18,255,215,0.3);
          }
        }

        .pixel-frame {
          position: relative;
          border: 0;
        }
        .pixel-frame::before {
          content: '';
          position: absolute;
          inset: -6px;
          background: transparent;
          box-shadow:
            0 0 0 2px rgba(18,255,215,0.35),
            0 0 0 6px rgba(6,35,28,0.9),
            0 0 0 8px rgba(18,255,215,0.25);
          pointer-events: none;
        }
        .pixel-frame-active { 
          box-shadow: 0 8px 0 0 #0e3a2e;
          animation: glow 3s ease-in-out infinite;
        }
        .pixel-frame-idle { box-shadow: 0 8px 0 0 #243331; }

        .pixel-button {
          color: #0a1612;
          background: #7fe9cf;
          box-shadow:
            0 6px 0 #1a6b57,
            0 0 0 2px rgba(10,22,18,0.5) inset;
          transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4);
          border: none;
          cursor: pointer;
        }
        .pixel-button:hover {
          filter: brightness(1.05);
        }
        .pixel-button:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 #1a6b57,
            0 0 0 2px rgba(10,22,18,0.6) inset;
        }

        .pixel-button-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .pixel-button-wrapper button {
          width: 100%;
          padding: 12px 24px;
          border-radius: 4px;
          font-family: 'Press Start 2P', ui-monospace, monospace !important;
          font-size: 12px;
          color: #0a1612 !important;
          background: #7fe9cf !important;
          box-shadow:
            0 6px 0 #1a6b57,
            0 0 0 2px rgba(10,22,18,0.5) inset !important;
          transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease !important;
          text-shadow: 0 1px 0 rgba(255,255,255,0.4) !important;
          border: none !important;
        }

        .pixel-button-wrapper button:hover {
          filter: brightness(1.05) !important;
        }

        .pixel-button-wrapper button:active {
          transform: translateY(2px) !important;
          box-shadow:
            0 2px 0 #1a6b57,
            0 0 0 2px rgba(10,22,18,0.6) inset !important;
        }

        .qr-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(18,255,215,0.05);
          border-radius: 8px;
          border: 2px solid rgba(18,255,215,0.2);
        }

        /* Import pixel font fallback via CDN (keeps logic untouched). 
           If you prefer Next Fonts, add it in layout.tsx later. */
        @font-face {
          font-family: 'Press Start 2P';
          font-style: normal;
          font-weight: 400;
          src: local('Press Start 2P'), url('https://fonts.gstatic.com/s/pressstart2p/v12/e3t4euO8T-267oIAQAu6jDQyK3nViv4.woff2') format('woff2');
          font-display: swap;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;