import React from "react";
import { FaHome, FaListAlt, FaPlusCircle, FaBullseye } from "react-icons/fa";

export default function Navigation({ screen, setScreen }) {
  const buttons = [
    { key: "home", icon: <FaHome size={24} />, label: "Home" },
    { key: "lancamentos", icon: <FaListAlt size={24} />, label: "Lançamentos" },
    { key: "formulario", icon: <FaPlusCircle size={24} />, label: "Novo" },
    { key: "objetivos", icon: <FaBullseye size={24} />, label: "Objetivos" },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md p-2 flex justify-between text-sm rounded-t-xl h-20">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => setScreen(btn.key)}
          className={`flex-1 mx-1 h-full rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
            screen === btn.key
              ? "bg-white/10 text-indigo-600 font-semibold shadow"
              : "bg-white/20 text-indigo-400 hover:bg-white/90"
          }`}
        >
          {btn.icon}
          <span className="text-xs mt-1">{btn.label}</span>
        </button>
      ))}
    </nav>
  );
}