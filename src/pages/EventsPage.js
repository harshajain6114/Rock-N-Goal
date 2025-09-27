// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAccount, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
// import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
// import GameLoader from "./GameLoader";

// const EventsPage = () => {
//   const navigate = useNavigate();
//   const { address } = useAccount();
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [isLoading, setIsLoading] = useState(false);

//   // Contract read hook to check if player is already registered
//   const { data: playerData, isLoading: isCheckingRegistration } = useContractRead({
//     address: CONTRACT_ADDRESS,
//     abi: CONTRACT_ABI,
//     functionName: 'players',
//     args: address ? [address] : undefined,
//     enabled: !!address, // Only run when address is available
//   });

//   // Contract write hook for register function
//   const { write: registerUser, data: hash, isLoading: isWriteLoading, error: writeError } = useContractWrite({
//     address: CONTRACT_ADDRESS,
//     abi: CONTRACT_ABI,
//     functionName: 'register',
//   });

//   // Wait for transaction to be mined
//   const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
//     hash,
//   });

//   const events = [
//     {
//       id: 1,
//       name: "Delhi Delight",
//       isActive: true,
//       category: "Community",
//       description:
//         "A legendary showdown to crown the greatest Monopoly player of all time",
//       participants: 4,
//       prize: "$500 Cash",
//       imgUrl: "/images/delhi.jpg",
//       fee: 100,
//       maxParticipants: 100,
//     },
//   ];

//   const filteredEvents =
//     activeFilter === "all"
//       ? events
//       : events.filter((event) =>
//           activeFilter === "active" ? event.isActive : !event.isActive
//         );

//   const handleJoinNow = async () => {
//     try {
//       if (!address) {
//         throw new Error("No wallet connected");
//       }
      
//       // Check if player is already registered
//       console.log("Player data:", playerData[0]);
//       if (playerData && playerData[0] !== "0x0000000000000000000000000000000000000000") {
//         console.log("Player already registered, navigating to dashboard");
//         navigate(`/dashboard`);
//         return;
//       }
      
//       // Call the register function on the smart contract
//       console.log("Registering new user:", address);
//       registerUser({
//         args: [address],
//       });
      
//     } catch (error) {
//       console.error("Error during registration:", error.message);
//     }
//   };

//   // Handle successful transaction
//   React.useEffect(() => {
//     if (isSuccess) {
//       console.log("User registered successfully!");
//       setIsLoading(false);
//       navigate(`/dashboard`);
//     }
//   }, [isSuccess, navigate]);

//   // Handle loading states
//   React.useEffect(() => {
//     if (isWriteLoading || isTransactionLoading) {
//       setIsLoading(true);
//     }
//   }, [isWriteLoading, isTransactionLoading]);

//   // Handle errors
//   React.useEffect(() => {
//     if (writeError) {
//       console.error("Contract write error:", writeError);
//       setIsLoading(false);
//     }
//   }, [writeError]);

//   return (
//     <>
//       {isLoading && <GameLoader />}

//       <div className="min-h-screen bg-[#0a0a2a] text-white overflow-hidden relative">
//         <div
//           className="absolute inset-0 opacity-10 pointer-events-none"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
//             backgroundSize: "4px 4px",
//           }}
//         />
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
//           <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
//           <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
//           <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
//         </div>

//         <div className="w-full flex flex-col justify-center items-center relative z-10 px-4 sm:px-6 lg:px-12 py-6 md:py-12">
//           <div className="text-center mb-8 md:mb-10">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
//               Dive into the Adventure
//             </h1>
//             <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto opacity-80">
//               Outplay, Outscore, and Outshine the Competition!
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//             {filteredEvents.map((event) => (
//               <div
//                 key={event.id}
//                 className={`flex max-w-sm flex-col h-full rounded-2xl p-6 relative overflow-hidden border-2 border-transparent ${
//                   event.isActive
//                     ? "bg-gradient-to-tr from-blue-900/70 to-purple-900/70 hover:border-blue-500"
//                     : "bg-gradient-to-tr from-gray-900/70 to-gray-800/70 hover:border-gray-600"
//                 } transform transition duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] group cursor-pointer`}
//               >
//                 <div className="absolute top-4 right-4 flex items-center space-x-2">
//                   <span
//                     className={`text-xs font-bold uppercase tracking-wider ${
//                       event.isActive ? "text-green-400" : "text-gray-400"
//                     }`}
//                   >
//                     {event.isActive ? "🎮 Live" : "⏳ Upcoming"}
//                   </span>
//                 </div>

//                 <div className="flex items-center mb-4">
//                   <div className="mr-4 opacity-80 group-hover:opacity-100 transition">
//                     <img
//                       src={event.imgUrl}
//                       alt=""
//                       className="w-20 h-20 rounded-full"
//                     />
//                   </div>
//                   <h2 className="text-lg sm:text-xl font-bold">{event.name}</h2>
//                 </div>

//                 <div className="mb-4 mt-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-sm text-blue-300">
//                       Registered Participants
//                     </span>
//                     <span className="text-sm font-bold text-blue-200">
//                       {event.participants} / {event.maxParticipants}
//                     </span>
//                   </div>
//                   <div className="w-full bg-blue-900 rounded-full h-2.5">
//                     <div
//                       className="bg-blue-600 h-2.5 rounded-full"
//                       style={{
//                         width: `${
//                           (event.participants / event.maxParticipants) * 100
//                         }%`,
//                       }}
//                     ></div>
//                   </div>
//                 </div>

//                 <p className="text-sm opacity-70 mb-4 flex-grow">
//                   {event.description}
//                 </p>

//                 <div className="mt-auto">
//                   {event.isActive ? (
//                     <button
//                       onClick={() => handleJoinNow()}
//                       className="w-full py-3 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition group relative overflow-hidden"
//                     >
//                       <span className="relative z-10">Enter</span>
//                       <div className="absolute inset-0 bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                       <span className="ml-2 group-hover:translate-x-1 transition">
//                         →
//                       </span>
//                     </button>
//                   ) : (
//                     <div className="bg-blue-500/10 py-3 rounded-lg text-center">
//                       {event.prize} Coming Soon
//                     </div>
//                   )}
//                   <div className="mt-1 text-center">
//                     Pool Entry Fee : $ {event.fee}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <img
//           src="/images/mono.png"
//           alt="Man Standing"
//           className="absolute bottom-0 left-0 w-[80%] sm:w-80 h-[30rem] sm:h-[48rem] transform scale-1"
//         />
//       </div>
//     </>
//   );
// };

// export default EventsPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
import GameLoader from "./GameLoader";

const EventsPage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Contract read hook to check if player is already registered
  const { data: playerData, isLoading: isCheckingRegistration } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'players',
    args: address ? [address] : undefined,
    enabled: !!address, // Only run when address is available
  });

  // Contract write hook for register function
  const { write: registerUser, data: hash, isLoading: isWriteLoading, error: writeError } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'register',
  });

  // Wait for transaction to be mined
  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
    hash,
  });

  const events = [
    {
      id: 1,
      name: "Delhi Delight",
      isActive: true,
      category: "Community",
      description:
        "A legendary showdown to crown the greatest Monopoly player of all time",
      participants: 4,
      prize: "$500 Cash",
      imgUrl: "/images/delhi.jpg",
      fee: 100,
      maxParticipants: 100,
    },
  ];

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) =>
          activeFilter === "active" ? event.isActive : !event.isActive
        );

  const handleJoinNow = async () => {
    try {
      if (!address) {
        throw new Error("No wallet connected");
      }
      
      // Check if player is already registered
      console.log("Player data:", playerData?.[0]);
      if (playerData && playerData[0] !== "0x0000000000000000000000000000000000000000") {
        console.log("Player already registered, navigating to dashboard");
        navigate(`/dashboard`);
        return;
      }
      
      // Call the register function on the smart contract
      console.log("Registering new user:", address);
      registerUser({
        args: [address],
      });
      
    } catch (error) {
      console.error("Error during registration:", error?.message || error);
    }
  };

  // Handle successful transaction
  React.useEffect(() => {
    if (isSuccess) {
      console.log("User registered successfully!");
      setIsLoading(false);
      navigate(`/dashboard`);
    }
  }, [isSuccess, navigate]);

  // Handle loading states
  React.useEffect(() => {
    if (isWriteLoading || isTransactionLoading) {
      setIsLoading(true);
    }
  }, [isWriteLoading, isTransactionLoading]);

  // Handle errors
  React.useEffect(() => {
    if (writeError) {
      console.error("Contract write error:", writeError);
      setIsLoading(false);
    }
  }, [writeError]);

  return (
    <>
      {isLoading && <GameLoader />}

      <div className="min-h-screen relative overflow-hidden text-foreground bg-[#0a1512]">
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

        {/* Header */}
        <header className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pt-10 pb-6 text-center">
          <h1
            className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black tracking-widest"
            style={{
              fontFamily: "'Press Start 2P', ui-monospace, monospace",
              textShadow: "0 0 6px #12ffd7, 0 0 18px rgba(18,255,215,0.4)",
              color: "#d6f7ee",
            }}
          >
            ROCK AND GOAL
          </h1>
          <p
            className="mt-4 max-w-3xl mx-auto text-pretty text-sm sm:text-base md:text-lg"
            style={{
              fontFamily: "'Press Start 2P', ui-monospace, monospace",
              color: "#7fe9cf",
              textShadow: "0 0 4px rgba(18,255,215,0.3)",
            }}
          >
            {"It's not just a game. It's an economic war fought with dice and sheer madness."}
          </p>
        </header>

        {/* Content */}
        <main className="relative z-10 w-full px-4 sm:px-6 lg:px-10 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="group relative mx-auto w-full max-w-sm">
                {/* Pixel frame wrapper */}
                <div
                  className={`rounded-lg p-6 relative overflow-hidden pixel-frame ${
                    event.isActive ? "pixel-frame-active" : "pixel-frame-idle"
                  }`}
                  style={{
                    background: "linear-gradient(180deg, rgba(6,28,22,0.9), rgba(4,18,15,0.95))",
                  }}
                >
                  {/* Status tag */}
                  <div className="absolute top-3 right-3">
                    <span
                      className="px-2 py-1 text-[10px] uppercase font-black tracking-widest rounded-sm"
                      style={{
                        fontFamily: "'Press Start 2P', ui-monospace, monospace",
                        background: event.isActive ? "#113a2e" : "#23302d",
                        color: event.isActive ? "#7fe9cf" : "#b3c7c2",
                        boxShadow: "inset 0 0 0 2px rgba(18,255,215,0.25)",
                      }}
                    >
                      {event.isActive ? "Live" : "Upcoming"}
                    </span>
                  </div>

                  {/* Title row */}
                  <div className="flex items-center mb-5">
                    <div className="mr-4 opacity-90 group-hover:opacity-100 transition">
                      <img
                        src={event.imgUrl || "/placeholder.svg"}
                        alt=""
                        className="w-16 h-16 rounded-md border border-[#12ffd7]/30"
                      />
                    </div>
                    <h2
                      className="text-lg sm:text-xl font-black"
                      style={{
                        fontFamily: "'Press Start 2P', ui-monospace, monospace",
                        color: "#e7fdf7",
                        textShadow: "0 0 4px rgba(18,255,215,0.2)",
                      }}
                    >
                      {event.name}
                    </h2>
                  </div>

                  {/* Participants: Pixel HP bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs" style={{ color: "#9ddfd0" }}>
                        Registered Participants
                      </span>
                      <span
                        className="text-xs font-black"
                        style={{
                          fontFamily: "'Press Start 2P', ui-monospace, monospace",
                          color: "#c4f5ea",
                        }}
                      >
                        {event.participants} / {event.maxParticipants}
                      </span>
                    </div>
                    <div
                      className="w-full h-4 rounded-sm overflow-hidden border"
                      style={{
                        borderColor: "rgba(18,255,215,0.35)",
                        background: "repeating-linear-gradient(90deg, #06231c 0 8px, #0b2e25 8px 16px)",
                        boxShadow: "inset 0 0 0 2px rgba(18,255,215,0.15)",
                      }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${(event.participants / event.maxParticipants) * 100}%`,
                          background: "repeating-linear-gradient(90deg, #23d17f 0 8px, #27f08f 8px 16px)",
                          boxShadow: "0 0 10px rgba(35,209,127,0.45)",
                          transition: "width 500ms ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm opacity-80 mb-5" style={{ color: "#c4f5ea" }}>
                    {event.description}
                  </p>

                  {/* Action */}
                  <div className="mt-auto">
                    {event.isActive ? (
                      <button
                        onClick={() => handleJoinNow()}
                        className="w-full py-3 rounded-sm pixel-button"
                        style={{
                          fontFamily: "'Press Start 2P', ui-monospace, monospace",
                        }}
                      >
                        Enter
                      </button>
                    ) : (
                      <div
                        className="py-3 text-center rounded-sm"
                        style={{
                          fontFamily: "'Press Start 2P', ui-monospace, monospace",
                          color: "#9ddfd0",
                          background: "linear-gradient(180deg, rgba(18,255,215,0.08), rgba(18,255,215,0.04))",
                          boxShadow: "inset 0 0 0 2px rgba(18,255,215,0.15)",
                        }}
                      >
                        {event.prize} Coming Soon
                      </div>
                    )}
                    <div className="mt-2 text-center text-xs" style={{ color: "#9ddfd0" }}>
                      Pool Entry Fee : $ {event.fee}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

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
          .pixel-frame-active { box-shadow: 0 8px 0 0 #0e3a2e; }
          .pixel-frame-idle { box-shadow: 0 8px 0 0 #243331; }

          .pixel-button {
            color: #0a1612;
            background: #7fe9cf;
            box-shadow:
              0 6px 0 #1a6b57,
              0 0 0 2px rgba(10,22,18,0.5) inset;
            transition: transform 120ms ease, box-shadow 120ms ease, filter 120ms ease;
            text-shadow: 0 1px 0 rgba(255,255,255,0.4);
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
    </>
  )
}

export default EventsPage