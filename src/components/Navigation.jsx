import React from "react";
import { FaHome, FaListAlt, FaPlusCircle, FaBullseye } from "react-icons/fa";

export default function Navigation({ screen, setScreen }) {
  const buttons = [
    { key: "home", icon: <FaHome size={22} />, label: "Home" },
    { key: "lancamentos", icon: <FaListAlt size={22} />, label: "Lançamentos" },
    { key: "formulario", icon: <FaPlusCircle size={22} />, label: "Novo" },
    { key: "objetivos", icon: <FaBullseye size={22} />, label: "Objetivos" },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md px-1 py-2 grid grid-cols-4 gap-1 text-sm rounded-t-xl h-20">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => setScreen(btn.key)}
          className={`h-full rounded-full transition-all duration-300 flex flex-col items-center justify-center ${
            screen === btn.key
              ? "bg-white/10 text-indigo-600 font-semibold shadow"
              : "bg-white/20 text-indigo-400 hover:bg-white/90"
          }`}
        >
          {btn.icon}
          <span className="text-[11px] mt-1">{btn.label}</span>
        </button>
      ))}
    </nav>
  );
}