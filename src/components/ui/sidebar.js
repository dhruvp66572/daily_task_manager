import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export function Sidebar({ weeklyData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleSidebar}
                className="p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white md:hidden fixed top-4 left-4 z-50"
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <div className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-transform duration-300 shadow-lg ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:w-64`}>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
                    <div className="space-y-4">
                        {Object.keys(weeklyData).map((date, index) => (
                            <div key={index} className="cursor-pointer" onClick={() => handleDateClick(date)}>
                                <h3 className="text-lg font-medium hover:underline">{date}</h3>
                            </div>
                        ))}
                    </div>
                    {selectedDate && (
                        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
                            <h3 className="text-lg font-medium mb-2">{selectedDate}</h3>
                            <ul className="list-disc list-inside ml-4">
                                {weeklyData[selectedDate].map((task, idx) => (
                                    <li key={idx}>{task}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
