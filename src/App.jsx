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
import Relatorios from "./components/Relatorios";
import { carregar, salvar } from "./utils/db";   // ✅ utilitário IndexedDB
import { registerSW } from "./serviceWorkerRegistration";
registerSW();



export default function App() {
  const [screen, setScreen] = useState("home");

  // categorias separadas
  const [categoriasReceita, setCategoriasReceita] = useState(["Salário", "Investimentos"]);
  const [categoriasDespesa, setCategoriasDespesa] = useState(["Alimentação", "Transporte", "Saúde"]);
  const [objetivos, setObjetivos] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [planejamentos, setPlanejamentos] = useState([]);
  const [planejamentoSelecionado, setPlanejamentoSelecionado] = useState(null);

  // ✅ Carregar dados do IndexedDB ao iniciar
  useEffect(() => {
    async function carregarDados() {
      setCategoriasReceita(await carregar("categoriasReceita", ["Salário", "Investimentos"]));
      setCategoriasDespesa(await carregar("categoriasDespesa", ["Alimentação", "Transporte", "Saúde"]));
      setObjetivos(await carregar("objetivos", []));
      setLancamentos(await carregar("lancamentos", []));
      setPlanejamentos(await carregar("planejamentos", []));
    }
    carregarDados();
  }, []);

  // ✅ Salvar sempre que mudar
  useEffect(() => { salvar("categoriasReceita", categoriasReceita); }, [categoriasReceita]);
  useEffect(() => { salvar("categoriasDespesa", categoriasDespesa); }, [categoriasDespesa]);
  useEffect(() => { salvar("objetivos", objetivos); }, [objetivos]);
  useEffect(() => { salvar("lancamentos", lancamentos); }, [lancamentos]);
  useEffect(() => { salvar("planejamentos", planejamentos); }, [planejamentos]);

  // Funções principais (iguais, só mudam os states)
  const adicionarCategoria = (nova, tipo) => {
    if (tipo === "receita") {
      if (nova && !categoriasReceita.includes(nova)) {
        setCategoriasReceita((prev) => [...prev, nova]);
      }
    } else {
      if (nova && !categoriasDespesa.includes(nova)) {
        setCategoriasDespesa((prev) => [...prev, nova]);
      }
    }
  };

  const adicionarLancamento = (novo) => {
    adicionarCategoria(novo.categoria, novo.tipo);
    setLancamentos((prev) => [...prev, novo]);
  };

  const excluirLancamento = (index) => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      setLancamentos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const adicionarPlanejamento = (novo) => {
    const uid = () => Math.random().toString(36).slice(2);
    if (novo.replicarAno) {
      const existeAno = planejamentos.some((p) => p.ano === novo.ano);
      if (existeAno) {
        alert(`Já existe planejamento para o ano ${novo.ano}.`);
        return;
      }
      const todosMeses = Array.from({ length: 12 }, (_, i) => i + 1);
      const replicados = todosMeses.map((mes) => ({ ...novo, mes, id: uid() }));
      setPlanejamentos((prev) => [...prev, ...replicados]);
    } else {
      const existe = planejamentos.some((p) => p.mes === novo.mes && p.ano === novo.ano);
      if (existe) {
        alert(`Já existe um planejamento para ${novo.mes}/${novo.ano}.`);
        return;
      }
      const base = { ...novo, id: uid() };
      setPlanejamentos((prev) => [...prev, base]);
    }
  };

  const atualizarPlanejamento = (atualizado) => {
    setPlanejamentos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)));
  };

  const excluirPlanejamento = (id) => {
    setPlanejamentos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center w-full max-w-md mx-auto p-4">
        {screen === "home" && <Home lancamentos={lancamentos} setScreen={setScreen} />}
        {screen !== "home" && (
          <div className="bg-white rounded-xl shadow-md p-1 text-gray-800 w-full h-[calc(100vh-180px)] overflow-y-auto">
            {screen === "lancamentos" && (
              <Lancamentos lancamentos={lancamentos} excluirLancamento={excluirLancamento} />
            )}
            {screen === "formulario" && (
              <Formulario
                categoriasReceita={categoriasReceita}
                categoriasDespesa={categoriasDespesa}
                adicionarLancamento={adicionarLancamento}
                adicionarCategoria={adicionarCategoria}
              />
            )}
            {screen === "objetivos" && (
              <Objetivos planejamentos={planejamentos} lancamentos={lancamentos} />
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
                categoriasReceita={categoriasReceita}
                categoriasDespesa={categoriasDespesa}
                adicionarCategoria={adicionarCategoria}
              />
            )}
            {screen === "editarPlanejamento" && planejamentoSelecionado && (
              <EditarPlanejamento
                planejamento={planejamentoSelecionado}
                atualizarPlanejamento={atualizarPlanejamento}
                setScreen={setScreen}
                categoriasReceita={categoriasReceita}
                categoriasDespesa={categoriasDespesa}
                adicionarCategoria={adicionarCategoria}
              />
            )}
            {screen === "relatorios" && (
              <Relatorios
                lancamentos={lancamentos}
                planejamentos={planejamentos}
                categoriasReceita={categoriasReceita}
                categoriasDespesa={categoriasDespesa}
              />
            )}
          </div>
        )}
      </main>
      <Navigation screen={screen} setScreen={setScreen} />
    </div>
  );
}