import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Lancamentos from "./components/Lancamentos";
import Formulario from "./components/Formulario";
import Objetivos from "./components/Objetivos";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("objetivo");

  // 🔒 Inicializa direto do localStorage
  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem("categorias");
    return saved
      ? JSON.parse(saved)
      : ["Alimentação", "Transporte", "Moradia", "Lazer", "Outros"];
  });

  const [objetivos, setObjetivos] = useState(() => {
    const saved = localStorage.getItem("objetivos");
    return saved ? JSON.parse(saved) : [];
  });

  const [lancamentos, setLancamentos] = useState(() => {
    const saved = localStorage.getItem("lancamentos");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔒 Salvar sempre que mudar
  useEffect(() => {
    localStorage.setItem("objetivos", JSON.stringify(objetivos));
  }, [objetivos]);

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  }, [lancamentos]);

  // Funções principais
  const adicionarObjetivo = (obj) => setObjetivos((prev) => [...prev, obj]);
  const excluirObjetivo = (index) =>
    setObjetivos((prev) => prev.filter((_, i) => i !== index));

  const adicionarCategoria = (nome) =>
    setCategorias((prev) => [...prev, nome]);
  const excluirCategoria = (index) => {
    const cat = categorias[index];
    setCategorias((prev) => prev.filter((_, i) => i !== index));
    setObjetivos((prev) => prev.filter((o) => o.categoria !== cat));
  };

  const adicionarLancamento = (novo) =>
    setLancamentos((prev) => [...prev, novo]);

  const excluirLancamento = (index) => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      setLancamentos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <Header />

        <main className="flex-1 mt-6 p-4">
          <div className="h-[calc(100vh-160px)] overflow-y-auto space-y-6">
            {screen === "home" && <Home lancamentos={lancamentos} />}
            {screen === "lancamentos" && (
              <Lancamentos
                lancamentos={lancamentos}
                excluirLancamento={excluirLancamento}
              />
            )}
            {screen === "formulario" && (
              <Formulario
                categorias={categorias}
                adicionarLancamento={adicionarLancamento}
              />
            )}
            {screen === "objetivos" && (
              <Objetivos
                objetivos={objetivos}
                categorias={categorias}
                adicionarObjetivo={adicionarObjetivo}
                excluirObjetivo={excluirObjetivo}
                adicionarCategoria={adicionarCategoria}
                excluirCategoria={excluirCategoria}
                showModal={showModal}
                setShowModal={setShowModal}
                modalType={modalType}
                setModalType={setModalType}
              />
            )}
          </div>
        </main>

        <Navigation screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}