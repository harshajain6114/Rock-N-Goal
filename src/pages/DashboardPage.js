import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, ShieldPlus, RefreshCw } from "lucide-react";
import mapboxgl from "mapbox-gl";
import carddata from "../data/cards";
import GameLoader from "./GameLoader";
import { useAccount, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract';
import { Leaf, Target } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [card, setCard] = useState();
  const [wallets, setWallets] = useState("");
  const [bal, setBal] = useState(0);
  const [bank, setBank] = useState(false);
  const [pos, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contract read hooks for player stats
  const { data: playerCurrency, refetch: refetchCurrency } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerCurrency',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: playerPosition, refetch: refetchPosition } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerPosition',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  const { data: playerCards, refetch: refetchCards } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerCards',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Contract read hook to get VRF fee
  const { data: vrfFee } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVRFFee',
  });

  // Contract write hook for nextMove function
  const { write: makeMove, data: moveHash, isLoading: isMoveLoading, error: moveError } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextMove',
  });

  // Wait for move transaction to be mined
  const { isLoading: isMoveTransactionLoading, isSuccess: isMoveSuccess, error: transactionError } = useWaitForTransaction({
    hash: moveHash,
    confirmations: 1,
    timeout: 60000, // 60 second timeout
  });


  // Helper function to convert wei to ETH
  const formatWeiToEth = (weiValue) => {
    if (!weiValue) return "0";
    const ethValue = Number(weiValue) / Math.pow(10, 18);
    return ethValue.toFixed(6);
  };


  const fetchWallets = useCallback(async () => {
    try {
      if (address) {
        console.log("Connected wallet address:", address);
        setWallets(address);
        setActiveSection("wallets");
      } else {
        setError("No wallet connected");
      }
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
    }
  }, [address]);

  // Function to refresh all contract data
  const refreshContractData = async () => {
    try {
      await Promise.all([
        refetchCurrency(),
        refetchPosition(),
        refetchCards()
      ]);
    } catch (error) {
      console.error("Error refreshing contract data:", error);
      setError("Failed to refresh contract data");
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Update local state when contract data changes
  useEffect(() => {
    if (playerCurrency !== undefined) {
      setBal(Number(playerCurrency));
      setData(Number(playerCurrency));
      if (Number(playerCurrency) <= 800) {
        setBank(true);
      }
    }
  }, [playerCurrency]);

  useEffect(() => {
    if (playerPosition !== undefined) {
      const position = Number(playerPosition);
      const maxPosition = carddata.cards.length - 1;
      const safePosition = Math.min(Math.max(position, 0), maxPosition);
      
      setPosition(position);
      setPlayerLocation(safePosition);
      setCard(carddata.cards[safePosition]);
    }
  }, [playerPosition]);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowMintCard(true);
    }
  }, [remainingTime]);

  const handleMintCardClick = async () => {
    try {
      if (!address) {
        throw new Error("No wallet connected");
      }

      if (!vrfFee) {
        throw new Error("VRF fee not available");
      }

      console.log("Making move for address:", address);
      console.log("VRF fee required:", vrfFee.toString());
      console.log("Contract address:", CONTRACT_ADDRESS);
      
      // Call the nextMove function on the smart contract with VRF fee
      makeMove({
        args: [address],
        value: vrfFee, // Pay the VRF fee required for random number generation
      });
      
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  // Handle successful move transaction
  useEffect(() => {
    if (isMoveSuccess) {
      console.log("Move completed successfully! Stopping loader...");
      
      // Stop the loader immediately - no delay
      setIsLoading(false);
      
      // Refresh contract data to get updated position and currency
      refreshContractData();
      
      // Update UI
      rollDiceAndMove();
      setRemainingTime(10);
      setShowMintCard(false);
      setShowCardDetails(true);
    }
  }, [isMoveSuccess]);

  // Log transaction hash when available
  useEffect(() => {
    if (moveHash) {
      console.log("Transaction hash:", moveHash);
    }
  }, [moveHash]);

  // Handle move loading states
  useEffect(() => {
    if (isMoveLoading || isMoveTransactionLoading) {
      console.log("Starting loader - isMoveLoading:", isMoveLoading, "isMoveTransactionLoading:", isMoveTransactionLoading);
      setIsLoading(true);
    }
  }, [isMoveLoading, isMoveTransactionLoading]);

  // Handle move errors
  useEffect(() => {
    if (moveError) {
      console.error("Move error:", moveError);
      console.log("Stopping loader due to error");
      // Stop the loader immediately on error
      setIsLoading(false);
    }
  }, [moveError]);

  // Handle transaction errors
  useEffect(() => {
    if (transactionError) {
      console.error("Transaction error:", transactionError);
      console.log("Stopping loader due to transaction error");
      // Stop the loader immediately on transaction error
      setIsLoading(false);
    }
  }, [transactionError]);

  const monopolyLocations = carddata.cards;

  const rollDiceAndMove = () => {
    if (rolling) return;
    setRolling(true);

    // Get the new position from the contract (this will be updated by the success handler)
    // For now, just simulate a simple move animation
    setTimeout(() => {
      setRolling(false);
    }, 2000); // 2 second animation
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmlzaGhoIiwiYSI6ImNtZzFyZGE0eDBzeHYya3NnYzJodncxdGkifQ.ihg3AxoxB52tSABUN_mCLw";

    // Ensure playerLocation is within bounds
    const safePlayerLocationForMap = Math.min(Math.max(playerLocation, 0), monopolyLocations.length - 1);
    const centerCoordinates = monopolyLocations[safePlayerLocationForMap]?.coordinates || monopolyLocations[0].coordinates;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: centerCoordinates,
      zoom: 16.5,
      pitch: 40,
      bearing: 53,
      style: "mapbox://styles/mapbox/standard",
      minZoom: 15,
      maxZoom: 17,
    });

    mapRef.current.on("load", () => {
      mapRef.current.setConfigProperty("basemap", "lightPreset", "dusk");

      mapRef.current.setConfigProperty("basemap", "showPlaceLabels", false);
      mapRef.current.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
      mapRef.current.setLayoutProperty("poi-label", "visibility", "none");
    });

    const safePlayerLocationForMarker = Math.min(Math.max(playerLocation, 0), monopolyLocations.length - 1);
    const playerCoordinates = monopolyLocations[safePlayerLocationForMarker]?.coordinates || monopolyLocations[0].coordinates;
    
    playerMarkerRef.current = new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat(playerCoordinates)
      .addTo(mapRef.current);

    monopolyLocations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({
        element: createCustomMarkerElement(location.type),
      })
        .setLngLat(location.coordinates)
        .addTo(mapRef.current);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3 style="cursor:pointer; color:blue;" id="location-${location.name}">
            ${location.name}
          </h3>
          <p>${location.details}</p>
        `);

      marker.setPopup(popup);
      marker.getElement().addEventListener("click", () => {
        marker.togglePopup();
        navigate(`/location/${location.name}`, {
          state: { location },
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (playerMarkerRef.current) {
      const safePlayerLocation = Math.min(Math.max(playerLocation, 0), monopolyLocations.length - 1);
      const coordinates = monopolyLocations[safePlayerLocation]?.coordinates;
      if (coordinates) {
        playerMarkerRef.current.setLngLat(coordinates);
      }
    }
  }, [playerLocation]);

  const createCustomMarkerElement = (placeType) => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "30px";
    markerElement.style.height = "30px";
    markerElement.style.backgroundSize = "cover";

    const icons = {
      loc: "/images/club.png",
    };

    const iconUrl = icons[placeType] || "/images/club.png";

    markerElement.style.backgroundImage = `url('${iconUrl}')`;

    return markerElement;
  };

  return (
    <div>
      {isLoading && <GameLoader />}
      <div
        id="map"
        style={{ height: "100vh", width: "100%" }}
        ref={mapContainerRef}
      />
      <div className="absolute top-4 left-5 bg-gradient-to-br from-green-800 to-emerald-900 text-lime-100 p-4 rounded-xl shadow-lg border-2 border-green-500">
        <div className="flex items-center space-x-4">
          <Leaf className="w-10 h-10 text-green-300 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-green-200 opacity-80">
              Game Zone Token
            </span>
            <code className="text-md font-mono bg-green-900/50 px-3 py-2 rounded-md tracking-wider border border-green-600">
              {wallets}
            </code>
          </div>
          <Target className="w-10 h-10 text-lime-400 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          🎮
        </div>
      </div>

      {/* Current Position Card */}
      <div
        className="absolute bottom-60 left-5 
        bg-gradient-to-br from-blue-800 to-cyan-900 
        text-white 
        p-4 
        rounded-xl 
        shadow-2xl 
        border-2 
        border-blue-400 
        w-1/5 
        h-auto 
        min-h-[120px]
        flex 
        flex-col 
        space-y-3 
        transform 
        transition-all 
        hover:scale-105 
        hover:shadow-3xl"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">📍</span>
            </div>
            <h2 className="text-lg font-bold text-blue-200 uppercase tracking-wider">
              Current Position
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-300">
            <img
              src={card?.image || "/images/punctuation.jpg"}
              alt={card?.name || "Position"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-100">
              {card?.name || "Unknown Location"}
            </span>
            <span className="text-xs text-blue-300 opacity-80">
              Position #{pos}
            </span>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div
        className="absolute bottom-10 left-5 
        bg-gradient-to-br from-indigo-800 to-purple-900 
        text-white 
        p-4 
        rounded-xl 
        shadow-2xl 
        border-2 
        border-yellow-500 
        w-1/5 
        h-auto 
        min-h-[150px]
        flex 
        flex-col 
        space-y-4 
        transform 
        transition-all 
        hover:scale-105 
        hover:shadow-3xl"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coins className="text-yellow-400 animate-bounce" size={32} />
            <h2 className="text-2xl font-bold text-yellow-300 uppercase tracking-wider">
              Balance
            </h2>
          </div>
          <ShieldPlus className="text-green-400 animate-pulse" size={28} />
        </div>

        <div className="flex-grow flex items-center justify-center gap-8">
          <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
            

            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
              {bal.toLocaleString()}
            </span>
            <span className="block text-sm text-gray-300 mt-1">Game Coins</span>
          </div>

          <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
           

            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
              {pos.toLocaleString()}
            </span>
            <span className="block text-sm text-gray-300 mt-1">Position</span>
          </div>
        </div>
      </div>
      {!showMintCard && (
        <div
          className="explore"
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Next Chance In: {Math.floor(remainingTime / 60)}:
          {String(remainingTime % 60).padStart(2, "0")}
        </div>
      )}
      {showMintCard && (
        <div
          className="explore"
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <div
            onClick={isMoveLoading || isMoveTransactionLoading ? undefined : handleMintCardClick}
            style={{
              cursor: isMoveLoading || isMoveTransactionLoading ? "not-allowed" : "pointer",
              padding: "8px 16px",
              // backgroundColor: isMoveLoading || isMoveTransactionLoading ? "#6B7280" : "#4F46E5",
              color: "white",
              borderRadius: "5px",
              fontWeight: "bold",
              opacity: isMoveLoading || isMoveTransactionLoading ? 0.7 : 1,
            }}
          >
            {isMoveLoading || isMoveTransactionLoading ? "PROCESSING..." : "MAKE MOVE"}
          </div>
          {vrfFee && (
            <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
              Fee: {formatWeiToEth(vrfFee)} ETH
            </div>
          )}
        </div>
      )}
      {showCardDetails && (
        <div
          style={{
            position: "absolute",
            bottom: "450px",
            right: "250px",
          }}
        >
          <div
            style={{ backgroundImage: `url(${card.image})` }}
            className="bg-cover bg-center w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow absolute"
          >
            <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-3 rounded-b-3xl">
              <p className="font-extrabold text-white">{card.name}</p>
              <p className="text-neutral-300">{card.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
