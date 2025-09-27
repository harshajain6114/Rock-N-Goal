import React from "react";

const Button = ({ label, onClick, disabled, className = "" }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg shadow-md transition ${disabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-700"
                } ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
