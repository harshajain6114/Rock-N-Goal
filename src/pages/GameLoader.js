import React from "react";
import { Gamepad2, Zap } from "lucide-react";

const GameLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a2a] via-[#1a1a3a] to-[#2a2a4a] overflow-hidden">
      <div className="relative w-80 h-80 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse rounded-full blur-2xl"></div>
        <div className="absolute w-full h-full">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full animate-spin-reverse-slow"></div>
          <div className="absolute inset-4 border-4 border-blue-500/20 rounded-full animate-spin-slow"></div>
        </div>
        <div
          className="absolute w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
          animate-pulse-slow shadow-2xl shadow-blue-500/50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
          <Gamepad2 className="text-white z-10" size={84} strokeWidth={1.5} />
          <Zap
            className="absolute top-2 right-2 text-yellow-300 animate-bounce"
            size={32}
            strokeWidth={2}
          />
          <Zap
            className="absolute bottom-2 left-2 text-yellow-300 animate-bounce"
            size={32}
            strokeWidth={2}
          />
        </div>
        <div className="absolute bottom-[-5rem] text-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse-slow">
            Connecting to Game Zone
            <span className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white ml-1">
              ...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoader;
