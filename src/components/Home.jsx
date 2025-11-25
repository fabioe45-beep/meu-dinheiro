import React, { useState } from "react";

export default function Home({ lancamentos = [] }) {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth()); // 0 = Janeiro
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Filtra lançamentos do mês/ano selecionado
  const lancamentosDoMes = lancamentos.filter((l) => {
    const data = new Date(l.data);
    return (
      data.getMonth() === mesSelecionado &&
      data.getFullYear() === anoSelecionado
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full">
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
          {/* Mostra anos próximos (ex: atual ± 5) */}
          {Array.from({ length: 11 }, (_, i) => anoSelecionado - 5 + i).map(
            (ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            )
          )}
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
  );
}