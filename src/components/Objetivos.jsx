import React, { useState } from "react";

export default function Objetivos({ planejamentos = [], lancamentos = [] }) {
  const ultimoPlanejamento = planejamentos[planejamentos.length - 1];
  const [mes, setMes] = useState(
    ultimoPlanejamento ? Number(ultimoPlanejamento.mes) : new Date().getMonth() + 1
  );
  const [ano, setAno] = useState(
    ultimoPlanejamento ? Number(ultimoPlanejamento.ano) : new Date().getFullYear()
  );

  const planejamentoSelecionado = (planejamentos || []).find(
    (p) => Number(p.mes) === mes && Number(p.ano) === ano
  );

  const receitaPlanejada = Number(parseFloat(planejamentoSelecionado?.receitaTotal || 0).toFixed(2));
  const despesasPlanejadas = planejamentoSelecionado?.despesas || [];
  const disponivelPlanejado = Number(parseFloat(planejamentoSelecionado?.disponivel || 0).toFixed(2));

  // Sempre baseado em dataPagamento
  const lancamentosFiltrados = lancamentos.filter((l) => {
    const [anoStr, mesStr] = (l.dataPagamento || "").split("-");
    return Number(mesStr) === mes && Number(anoStr) === ano;
  });

  const receitaReal = Number(
    parseFloat(
      lancamentosFiltrados
        .filter((l) => l.tipo?.toLowerCase() === "receita")
        .reduce((acc, l) => acc + Number(l.valor || 0), 0)
    ).toFixed(2)
  );

  // Despesas por categoria planejada
  const despesasReaisPorCategoria = despesasPlanejadas.map((d) => {
    const planejado = Number(
      parseFloat(d.itens?.reduce((acc, it) => acc + Number(it.valor || 0), 0) || 0).toFixed(2)
    );
    const realizado = Number(
      parseFloat(
        lancamentosFiltrados
          .filter(
            (l) =>
              l.tipo?.toLowerCase() === "despesa" &&
              l.categoria?.toLowerCase() === d.categoria?.toLowerCase()
          )
          .reduce((acc, l) => acc + Number(l.valor || 0), 0)
      ).toFixed(2)
    );

    return { categoria: d.categoria, planejado, realizado };
  });

  // Evolução do card Disponível = soma de todas as despesas de categorias NÃO planejadas
  const categoriasPlanejadas = (despesasPlanejadas || []).map((d) =>
    (d.categoria || "").toLowerCase()
  );

  const disponivelEvolucao = Number(
    parseFloat(
      lancamentosFiltrados
        .filter(
          (l) =>
            l.tipo?.toLowerCase() === "despesa" &&
            !categoriasPlanejadas.includes((l.categoria || "").toLowerCase())
        )
        .reduce((acc, l) => acc + Number(l.valor || 0), 0)
    ).toFixed(2)
  );

  // Anos dinâmicos (ano atual -2 até ano atual +2)
  const anoAtual = new Date().getFullYear();
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => anoAtual - 2 + i);

  // Helpers de percentual e largura (evitam NaN/Infinity)
  const pct = (real, plan) =>
    plan > 0 ? Number(((real / plan) * 100).toFixed(1)) : 0;
  const widthPct = (real, plan) =>
    plan > 0 ? Math.min((real / plan) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-indigo-600">Objetivos</h2>
        <div className="flex gap-1 text-xs text-gray-600">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="px-2 py-1 border rounded bg-gray-50"
          >
            <option value="1">Jan</option>
            <option value="2">Fev</option>
            <option value="3">Mar</option>
            <option value="4">Abr</option>
            <option value="5">Mai</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Ago</option>
            <option value="9">Set</option>
            <option value="10">Out</option>
            <option value="11">Nov</option>
            <option value="12">Dez</option>
          </select>

          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="px-2 py-1 border rounded bg-gray-50"
          >
            {anosDisponiveis.map((anoOption) => (
              <option key={anoOption} value={anoOption}>
                {anoOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!planejamentoSelecionado ? (
        <p className="text-gray-500">
          Nenhum planejamento encontrado para {mes}/{ano}.
        </p>
      ) : (
        <>
          {/* Receitas */}
          <div className="mb-6 border rounded p-2 bg-gradient-to-r from-green-50 to-emerald-100">
            <h3 className="font-semibold mb-2">Receitas</h3>
            <p>Planejado: R$ {receitaPlanejada.toFixed(2)}</p>
            <p>Realizado: R$ {receitaReal.toFixed(2)}</p>
            <p className="font-semibold">
              Diferença: R$ {(receitaReal - receitaPlanejada).toFixed(2)} (
              {pct(receitaReal, receitaPlanejada)}%)
            </p>
            <div className="w-full bg-gray-200 rounded h-4 mt-2">
              <div
                className="h-4 rounded bg-green-500 transition-all duration-500"
                style={{
                  width: `${widthPct(receitaReal, receitaPlanejada)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Despesas planejadas */}
          <div className="mb-6 border rounded p-2 bg-gradient-to-r from-red-50 to-pink-100">
            <h3 className="font-semibold mb-2">Despesas</h3>
            {despesasReaisPorCategoria.map((d, idx) => {
              const saldo = Number((d.planejado - d.realizado).toFixed(2));
              return (
                <div
                  key={idx}
                  className="mb-4 border rounded p-2 bg-gradient-to-r from-red-50 to-pink-100"
                >
                  <p className="font-semibold">{d.categoria}</p>
                  <p>Planejado: R$ {d.planejado.toFixed(2)}</p>
                  <p>Realizado: R$ {d.realizado.toFixed(2)}</p>
                  <p className="font-semibold">
                    Saldo: R$ {saldo.toFixed(2)} ({pct(d.realizado, d.planejado)}%)
                  </p>
                  <div className="w-full bg-gray-200 rounded h-4 mt-2">
                    <div
                      className="h-4 rounded bg-red-500 transition-all duration-500"
                      style={{
                        width: `${widthPct(d.realizado, d.planejado)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disponível */}
          <div className="mb-6 border rounded p-2 bg-gradient-to-r from-blue-50 to-indigo-100">
            <h3 className="font-semibold mb-2">Disponível</h3>
            <p>Planejado: R$ {disponivelPlanejado.toFixed(2)}</p>
            <p>Realizado: R$ {disponivelEvolucao.toFixed(2)}</p>
            <p className="font-semibold">
              Saldo: R$ {(disponivelPlanejado - disponivelEvolucao).toFixed(2)} (
              {pct(disponivelEvolucao, disponivelPlanejado)}%)
            </p>
            <div className="w-full bg-gray-200 rounded h-4 mt-2">
              <div
                className={`h-4 rounded ${
                  disponivelEvolucao <= disponivelPlanejado ? "bg-green-500" : "bg-red-500"
                } transition-all duration-500`}
                style={{
                  width: `${widthPct(disponivelEvolucao, disponivelPlanejado)}%`,
                }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}