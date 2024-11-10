import React, { useState } from 'react';

const Sidebar = ({ setRadius }: { setRadius: (radius: number) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [radius, setLocalRadius] = useState(50); // Default radius: 50 miles

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setLocalRadius(value);
        setRadius(value); // Update the radius in the parent component
    };

    return (
        <div>
            {/* Sidebar container */}
            <div
                className={`fixed top-0 left-0 z-30 h-screen bg-gray-800 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'
                    }`}
            >
                {/* Slider and settings inside the sidebar */}
                {isOpen && (
                    <div className="px-6 mt-4">
                        <h2 className="text-white text-xl mb-4">Set Radius</h2>
                        <div className="flex flex-col">
                            <label className="text-white mb-2">Radius: {radius} miles</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={radius}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Toggle button (arrow) on the side */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-1/2 left-0 transform -translate-y-1/2 bg-black text-white z-40 p-2 rounded-r-full"
            >
                {isOpen ? '→' : '←'}
            </button>
        </div>
    );
};

export default Sidebar;
