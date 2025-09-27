import React from "react";
import { ChevronLeft, Glasses, Gamepad2, Trophy } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const LocationDetails = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const location = useLocation();

  const gameCards = [
    {
      title: "Virtual Reality Arena",
      description: "Immerse yourself in cutting-edge VR experiences",
      icon: Glasses,
      color: "bg-blue-500",
      gradient: "from-blue-600 to-blue-900",
      pattern:
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-blue-900",
    },
    {
      title: "Multiplayer Zones",
      description: "Team up and compete in epic multiplayer challenges",
      icon: Gamepad2,
      color: "bg-green-500",
      gradient: "from-green-600 to-green-900",
      pattern:
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-700 via-green-800 to-green-900",
    },
    {
      title: "Esports Corner",
      description: "Professional gaming setups for competitive players",
      icon: Trophy,
      color: "bg-purple-500",
      gradient: "from-purple-600 to-purple-900",
      pattern:
        "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-700 via-purple-800 to-purple-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="mb-8 max-w-6xl ml-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex rounded-lg bg-red-800 p-4 items-center text-gray-300 hover:text-white transition-all duration-300 
             hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)] hover:scale-105 transform active:scale-95 focus:outline-none"
        >
          <ChevronLeft className="mr-2 w-6 h-6" />
          <span className="font-semibold tracking-wider text-shadow-md">
            Back to Dashboard
          </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="p-8 mb-12 hover:scale-[1.01] ">
          <div className="flex items-center mb-6 space-x-4">
            <h1
              className="text-4xl font-extrabold text-transparent bg-clip-text 
                bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600
                text-shadow-xl drop-shadow-2xl transform-gpu transition-all duration-500 hover:scale-105"
            >
              {name} Gaming Zone
            </h1>
            <span className="animate-pulse text-2xl text-blue-500">🎮</span>
          </div>

          <p
            className="text-lg text-gray-300 leading-relaxed font-medium tracking-wide opacity-80 
               hover:text-white transition duration-300 ease-in-out"
          >
            {location.state?.location.details ||
              "Dive into the ultimate gaming experience"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {gameCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl 
                            transform transition-all duration-300 hover:-translate-y-2 
                            hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-0 ${card.pattern} opacity-90`}
                />
                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 ${card.color} bg-opacity-20 rounded-full mr-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-white/80 text-sm mb-6 flex-grow">
                    {card.description}
                  </p>
                  <div
                    className="absolute inset-0 bg-black/50 opacity-0 
                               transition-opacity duration-300 flex items-center justify-center"
                  ></div>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs text-white/70">
                      Gaming Experience
                    </span>
                    <div className="w-10 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
