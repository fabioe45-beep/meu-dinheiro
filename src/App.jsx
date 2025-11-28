import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Lancamentos from "./components/Lancamentos";
import Formulario from "./components/Formulario";
import Objetivos from "./components/Objetivos";

import Planejamento from "./components/Planejamento";
import NovoPlanejamento from "./components/NovoPlanejamento";
import EditarPlanejamento from "./components/EditarPlanejamento";


export default function App() {
  const [screen, setScreen] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("objetivo");

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

  const [planejamentos, setPlanejamentos] = useState(() => {
    const saved = localStorage.getItem("planejamentos");
    return saved ? JSON.parse(saved) : [];
  });

  const [planejamentoSelecionado, setPlanejamentoSelecionado] = useState(null);

  // Persistência
  useEffect(() => {
    localStorage.setItem("objetivos", JSON.stringify(objetivos));
  }, [objetivos]);

  useEffect(() => {
    localStorage.setItem("categorias", JSON.stringify(categorias));
  }, [categorias]);

  useEffect(() => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  }, [lancamentos]);

  useEffect(() => {
    localStorage.setItem("planejamentos", JSON.stringify(planejamentos));
  }, [planejamentos]);

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

  const adicionarPlanejamento = (novo) => {
    const uid = () => Math.random().toString(36).slice(2);
const adicionarPlanejamento = (novo) => {
  const uid = () => Math.random().toString(36).slice(2);
  const base = { ...novo, id: uid() };
  setPlanejamentos((prev) => {
    const atualizados = [...prev, base];
    console.log("Planejamentos atualizados:", atualizados);
    return atualizados;
  });
};
    if (novo.replicarAno) {
      // 🔎 Bloqueia se já houver qualquer mês daquele ano
      const existeAno = planejamentos.some((p) => p.ano === novo.ano);
      if (existeAno) {
        alert(`Já existe planejamento para o ano ${novo.ano}.`);
        return;
      }
      const todosMeses = Array.from({ length: 12 }, (_, i) => i + 1);
      const replicados = todosMeses.map((mes) => ({
        ...novo,
        mes,
        id: uid(),
      }));
      setPlanejamentos((prev) => [...prev, ...replicados]);
    } else {
      // 🔎 Bloqueia se já houver para o mesmo mês/ano
      const existe = planejamentos.some(
        (p) => p.mes === novo.mes && p.ano === novo.ano
      );
      if (existe) {
        alert(`Já existe um planejamento para ${novo.mes}/${novo.ano}.`);
        return;
      }
      const base = { ...novo, id: uid() };
      setPlanejamentos((prev) => [...prev, base]);
    }
  };

  const atualizarPlanejamento = (atualizado) => {
    setPlanejamentos((prev) =>
      prev.map((p) => (p.id === atualizado.id ? atualizado : p))
    );
  };

  const excluirPlanejamento = (id) => {
    setPlanejamentos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <Header />

        <main className="flex-1 mt-6 p-4">
          <div className="h-[calc(100vh-160px)] overflow-y-auto space-y-6">
            {screen === "home" && (
              <Home lancamentos={lancamentos} setScreen={setScreen} />
            )}
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
    planejamentos={planejamentos}   // ✅ ajuste: passa os planejamentos
    lancamentos={lancamentos}       // ✅ ajuste: passa os lançamentos
  />
)}
            {screen === "orcamento" && (
              <Orcamento lancamentos={lancamentos} />
            )}
            {screen === "planejamento" && (
              <Planejamento
                planejamentos={planejamentos}
                setScreen={setScreen}
                setPlanejamentoSelecionado={setPlanejamentoSelecionado}
                excluirPlanejamento={excluirPlanejamento}
              />
            )}
           {screen === "novoPlanejamento" && (
  <NovoPlanejamento
    adicionarPlanejamento={adicionarPlanejamento}
    setScreen={setScreen}
    categorias={categorias}
    adicionarCategoria={adicionarCategoria} // ✅ passe a função do App
  />
)}

            {screen === "editarPlanejamento" && planejamentoSelecionado && (
              <EditarPlanejamento
                planejamento={planejamentoSelecionado}
                atualizarPlanejamento={atualizarPlanejamento}
                setScreen={setScreen}
                categorias={categorias}
              />
            )}
          </div>
        </main>

        <Navigation screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}