import React, { useState } from "react";

export default function Lancamentos({ lancamentos, excluirLancamento }) {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [categoria, setCategoria] = useState("");
  const [usarDataPagamento, setUsarDataPagamento] = useState(false);
  const [tipo, setTipo] = useState(""); // ✅ novo filtro de tipo

  // Função para aplicar filtros
  const filtrarLancamentos = () => {
    return lancamentos.filter((l) => {
      const dataBase = usarDataPagamento ? l.dataPagamento : l.data;
      const [anoStr, mesStr] = dataBase.split("-");
      const condMes = mes ? Number(mesStr) === Number(mes) : true;
      const condAno = ano ? Number(anoStr) === Number(ano) : true;
      const condCategoria = categoria ? l.categoria === categoria : true;
      const condTipo = tipo ? l.tipo === tipo : true;
      return condMes && condAno && condCategoria && condTipo;
    });
  };

  const filtrados = filtrarLancamentos();

  // Resumo discreto
  const total = filtrados.reduce((acc, l) => acc + l.valor, 0);

  // Lista dinâmica de anos existentes nos lançamentos
  const anosDisponiveis = [
    ...new Set(lancamentos.map((l) => l.data.split("-")[0])),
    ...new Set(lancamentos.map((l) => l.dataPagamento.split("-")[0])),
  ].sort();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Lançamentos</h2>

      {/* 🔎 Filtros compactos */}
      <div className="flex flex-wrap gap-2 mb-2 text-xs text-gray-600">
        <select
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Mês</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Ano</option>
          {anosDisponiveis.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Categoria</option>
          {[...new Set(lancamentos.map((l) => l.categoria))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* ✅ filtro de tipo */}
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Tipo</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={usarDataPagamento}
            onChange={(e) => setUsarDataPagamento(e.target.checked)}
          />
          <span>Pagamento</span>
        </label>
      </div>

      {/* 📊 Resumo discreto */}
      <p className="text-xs text-gray-500 mb-3">
        {filtrados.length} lançamentos • Total R$ {total.toFixed(2)}
      </p>

      {filtrados.length === 0 ? (
        <p className="text-gray-400 text-sm">Nenhum lançamento encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {filtrados.map((l, index) => {
            const diferencaPagamento = l.dataPagamento !== l.data;
            return (
              <li
                key={index}
                className={`flex justify-between items-center border-b pb-1 rounded px-2 ${
                  diferencaPagamento ? "bg-indigo-50" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-sm flex items-center gap-2">
                    {l.descricao}
                    {l.parcela && (
                      <span className="text-xs text-gray-500">
                        (Parcela {l.parcela.atual}/{l.parcela.total})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {l.tipo} • {l.categoria}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    Data: {l.data}
                    {diferencaPagamento && (
                      <span
                        className="ml-1 text-indigo-500 flex items-center gap-1"
                        title={`Pagamento em ${l.dataPagamento}`}
                      >
                        {/* 🔹 Ícone discreto */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs text-gray-500">
                          ({l.dataPagamento})
                        </span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-800">R$ {l.valor.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => excluirLancamento(index)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  Excluir
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}