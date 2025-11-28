import React, { useState } from "react";

export default function Objetivos({ planejamentos = [], lancamentos = [] }) {
  const ultimoPlanejamento = planejamentos[planejamentos.length - 1];
  const [mes, setMes] = useState(
    ultimoPlanejamento ? Number(ultimoPlanejamento.mes) : new Date().getMonth() + 1
  );
  const [ano, setAno] = useState(
    ultimoPlanejamento ? Number(ultimoPlanejamento.ano) : new Date().getFullYear()
  );

  console.log("Planejamentos disponíveis:", planejamentos);
  console.log("Filtro atual:", mes, ano);

  const planejamentoSelecionado = (planejamentos || []).find(
    (p) => Number(p.mes) === mes && Number(p.ano) === ano
  );

  const receitaPlanejada = planejamentoSelecionado?.receitaTotal || 0;
  const despesasPlanejadas = planejamentoSelecionado?.despesas || [];

  const lancamentosFiltrados = lancamentos.filter((l) => {
    const dt = new Date(l.data);
    return dt.getMonth() + 1 === mes && dt.getFullYear() === ano;
  });

  const receitaReal = lancamentosFiltrados
    .filter((l) => l.tipo.toLowerCase() === "receita")
    .reduce((acc, l) => acc + Number(l.valor || 0), 0);

  const despesasReaisPorCategoria = despesasPlanejadas.map((d) => {
    const planejado = d.itens?.reduce((acc, it) => acc + Number(it.valor || 0), 0);
    const realizado = lancamentosFiltrados
      .filter(
        (l) =>
          l.tipo.toLowerCase() === "despesa" &&
          l.categoria.toLowerCase() === d.categoria.toLowerCase()
      )
      .reduce((acc, l) => acc + Number(l.valor || 0), 0);

    return { categoria: d.categoria, planejado, realizado };
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-indigo-600">Objetivos</h2>
        <div className="flex gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>

          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="p-2 border rounded w-24"
            placeholder="Ano"
          />
        </div>
      </div>

      {!planejamentoSelecionado ? (
        <p className="text-gray-500">
          Nenhum planejamento encontrado para {mes}/{ano}.
        </p>
      ) : (
        <>
          {/* Receitas (mantém diferença) */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Receitas</h3>
            <p>Planejado: R$ {receitaPlanejada}</p>
            <p>Realizado: R$ {receitaReal}</p>
            <p className="font-semibold">
              Diferença: R$ {receitaReal - receitaPlanejada} (
              {receitaPlanejada > 0
                ? ((receitaReal / receitaPlanejada) * 100).toFixed(1)
                : "0"}%)
            </p>

            <div className="w-full bg-gray-200 rounded h-4 mt-2">
              <div
                className="h-4 rounded bg-green-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (receitaReal / receitaPlanejada) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Despesas (usa saldo) */}
          <div>
            <h3 className="font-semibold mb-2">Despesas</h3>
            {despesasReaisPorCategoria.map((d, idx) => {
              const saldo = d.planejado - d.realizado;
              return (
                <div key={idx} className="mb-4 border rounded p-2">
                  <p className="font-semibold">{d.categoria}</p>
                  <p>Planejado: R$ {d.planejado}</p>
                  <p>Realizado: R$ {d.realizado}</p>
                  <p className="font-semibold">
                    Saldo: R$ {saldo} (
                    {d.planejado > 0
                      ? ((d.realizado / d.planejado) * 100).toFixed(1)
                      : "0"}%)
                  </p>

                  <div className="w-full bg-gray-200 rounded h-4 mt-2">
                    <div
                      className="h-4 rounded bg-red-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (d.realizado / d.planejado) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}