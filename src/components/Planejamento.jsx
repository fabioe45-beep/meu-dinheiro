import React, { useState } from "react";

export default function Planejamento({
  planejamentos,
  setScreen,
  setPlanejamentoSelecionado,
  excluirPlanejamento,
}) {
  // 🔎 mês e ano atuais
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  // Estados do filtro já iniciados com mês/ano vigentes
  const [filtroMes, setFiltroMes] = useState(mesAtual.toString());
  const [filtroAno, setFiltroAno] = useState(anoAtual.toString());

  // Filtra planejamentos conforme seleção
  const planejamentosFiltrados = planejamentos.filter((p) => {
    const mesOk = filtroMes ? p.mes === Number(filtroMes) : true;
    const anoOk = filtroAno ? p.ano === Number(filtroAno) : true;
    return mesOk && anoOk;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full relative flex flex-col">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Planejamentos</h2>

      {/* Filtro */}
      <div className="flex gap-2 mb-4">
        <select
          value={filtroMes}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os meses</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todos os anos</option>
          {[2024, 2025, 2026, 2027].map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {/* 🔎 Área rolável */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {planejamentosFiltrados.length === 0 ? (
          <p className="text-gray-500">Nenhum planejamento encontrado.</p>
        ) : (
          planejamentosFiltrados.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer relative"
              onClick={() => {
                setPlanejamentoSelecionado(p);
                setScreen("editarPlanejamento");
              }}
            >
              <h3 className="font-semibold text-indigo-600 mb-2">
                {p.mes}/{p.ano}
              </h3>

              {/* Receitas */}
              <div className="mb-2">
                <p className="font-bold">Receitas</p>
                {p.receitas && p.receitas.length > 0 ? (
                  p.receitas.map((r, idx) => (
                    <p key={idx}>
                      {r.categoria}: R$ {r.valor}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhuma receita</p>
                )}
                <p className="mt-1 font-semibold">Total: R$ {p.receitaTotal}</p>
              </div>

              {/* Despesas */}
<div>
  <p className="font-bold">Despesas</p>
  {p.despesas && p.despesas.length > 0 ? (
    p.despesas.map((d, idx) => {
      const totalCategoria = d.itens.reduce((acc, it) => acc + Number(it.valor || 0), 0);
      return (
        <div key={idx} className="mb-2">
          <p className="font-semibold">{d.categoria} — Total: R$ {totalCategoria}</p>
          {d.itens.length > 0 ? (
            <ul className="ml-6 list-disc">
              {d.itens.map((it, j) => (
                <li key={j}>
                  {it.nome} — R$ {it.valor}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 ml-6">Nenhum item adicionado.</p>
          )}
        </div>
      );
    })
  ) : (
    <p className="text-gray-500">Nenhuma despesa</p>
  )}
  <p className="mt-1 font-semibold">Total: R$ {p.despesasTotal}</p>
</div>

              {/* Botão excluir */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm("Tem certeza que deseja excluir este planejamento?")
                  ) {
                    excluirPlanejamento(p.id);
                  }
                }}
                className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-400/90 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>

      {/* Botão quadrado com + no canto inferior direito */}
      <button
        onClick={() => setScreen("novoPlanejamento")}
        className="absolute bottom-6 right-6 bg-gradient-to-r from-pink-500 to-pink-500/70 text-white w-15 h-15 flex items-center justify-center rounded-lg shadow-lg hover:bg-indigo-700"
      >
        +
      </button>
    </div>
  );
}