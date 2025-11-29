import React, { useState } from "react";
import { FaDollarSign, FaChartBar } from "react-icons/fa";

export default function Home({ lancamentos = [], setScreen }) {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth()); // 0 = Janeiro
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // ✅ Filtra lançamentos do mês/ano selecionado usando dataPagamento
  const lancamentosDoMes = lancamentos.filter((l) => {
    if (!l.dataPagamento) return false;
    const [anoStr, mesStr] = l.dataPagamento.split("-");
    return (
      Number(mesStr) - 1 === mesSelecionado &&
      Number(anoStr) === anoSelecionado
    );
  });

  // Calcula totais
  const totalReceitas = lancamentosDoMes
    .filter((l) => l.tipo.toLowerCase() === "receita")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const totalDespesas = lancamentosDoMes
    .filter((l) => l.tipo.toLowerCase() === "despesa")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const saldo = totalReceitas - totalDespesas;

  const formatar = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // ✅ Lista dinâmica de anos (ano anterior, atual e próximo)
  const anoAtual = hoje.getFullYear();
  const anosDisponiveis = [anoAtual - 1, anoAtual, anoAtual + 1];

  return (
    <div className="w-full">
      {/* Container branco */}
      <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full">
        {/* Cabeçalho com selects */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-indigo-600">Resumo do Mês</h2>
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="border rounded-lg p-1 text-sm"
          >
            {meses.map((mes, idx) => (
              <option key={mes} value={idx}>
                {mes}
              </option>
            ))}
          </select>
          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="border rounded-lg p-1 text-sm"
          >
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </div>

        {/* Resumo */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Receitas:</span>
            <span className="text-green-600">{formatar(totalReceitas)}</span>
          </div>
          <div className="flex justify-between">
            <span>Despesas:</span>
            <span className="text-red-600">{formatar(totalDespesas)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Saldo:</span>
            <span className={saldo >= 0 ? "text-green-600" : "text-red-600"}>
              {formatar(saldo)}
            </span>
          </div>
        </div>
      </div>

      {/* Ícones abaixo */}
      <div className="mt-16 flex justify-around w-full max-w-md">
        {/* Relatórios */}
        <div
          onClick={() => setScreen("relatorios")}
          className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <FaChartBar size={64} className="text-white" />
          <span className="mt-2 text-white font-semibold">Relatórios</span>
        </div>

        {/* Planejamento */}
        <div
          onClick={() => setScreen("planejamento")}
          className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <FaDollarSign size={64} className="text-white" />
          <span className="mt-2 text-white font-semibold">Planejamento</span>
        </div>
      </div>
    </div>
  );
}