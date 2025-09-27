import React from "react";

const EventCard = ({ event, onJoin }) => {
    return (
        <div
            className={`p-6 rounded-lg shadow-lg ${event.isActive ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                }`}
        >
            <h2 className="text-xl font-semibold">{event.name}</h2>
            {event.isActive && (
                <button
                    onClick={onJoin}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
                >
                    Join Event
                </button>
            )}
        </div>
    );
};

export default EventCard;
