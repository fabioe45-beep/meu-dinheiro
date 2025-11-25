import React from "react";

export default function Navigation({ screen, setScreen }) {
  const buttons = [
    { key: "home", label: "Home" },
    { key: "lancamentos", label: "Lançamentos" },
    { key: "formulario", label: "Novo" },
    { key: "objetivos", label: "Objetivos" },
  ];

  return (
    <nav className="bg-white/20 backdrop-blur-md p-2 flex justify-between text-sm rounded-t-xl h-16">
      {buttons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => setScreen(btn.key)}
          className={`flex-1 mx-1 h-12 rounded-full transition-all duration-300 ${
            screen === btn.key
              ? "bg-white text-indigo-600 font-semibold shadow"
              : "bg-white/10 text-gray-900 hover:bg-white/30"
          }`}
        >
          {btn.label}
        </button>
      ))}
    </nav>
  );
}