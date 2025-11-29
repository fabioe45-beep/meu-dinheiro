import React, { useState } from "react";

export default function Relatorios({
  lancamentos,
  planejamentos,
  categoriasReceita = [],
  categoriasDespesa = []
}) {
  const [tipo, setTipo] = useState("todos");
  const [categoria, setCategoria] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [usarDataPagamento, setUsarDataPagamento] = useState(false);

  // meses e anos vindos dos lançamentos (extraídos da data OU dataPagamento)
  const mesesUnicos = [...new Set(
    lancamentos.map((l) => {
      const d = new Date(usarDataPagamento ? l.dataPagamento : l.data);
      return d.getMonth() + 1;
    })
  )].sort((a, b) => a - b);

  const anosUnicos = [...new Set(
    lancamentos.map((l) => {
      const d = new Date(usarDataPagamento ? l.dataPagamento : l.data);
      return d.getFullYear();
    })
  )].sort((a, b) => a - b);

  // categorias filtradas conforme o tipo
  let categoriasDisponiveis = [];
  if (tipo === "receita") {
    categoriasDisponiveis = categoriasReceita;
  } else if (tipo === "despesa") {
    categoriasDisponiveis = categoriasDespesa;
  } else {
    categoriasDisponiveis = [...categoriasReceita, ...categoriasDespesa];
  }

  // aplica filtros
  const filtrados = lancamentos.filter((l) => {
    const d = new Date(usarDataPagamento ? l.dataPagamento : l.data);
    const condTipo = tipo === "todos" || l.tipo === tipo;
    const condCategoria = !categoria || l.categoria === categoria;
    const condMes = !mes || (d.getMonth() + 1) === Number(mes);
    const condAno = !ano || d.getFullYear() === Number(ano);
    return condTipo && condCategoria && condMes && condAno;
  });

  // ✅ Resumo calculado APENAS com os filtrados
  const totalReceitas = filtrados
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const totalDespesas = filtrados
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const saldo = totalReceitas - totalDespesas;

  const nomesMeses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700 text-center">
        Relatórios Financeiros
      </h2>

      {/* Filtros */}
      <div className="bg-white rounded-lg p-4 shadow space-y-2">
        <h3 className="text-lg font-semibold text-indigo-600">Filtros</h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Tipo */}
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setCategoria("");
            }}
            className="border rounded p-2"
          >
            <option value="todos">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>

          {/* Categoria */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Todas categorias</option>
            {categoriasDisponiveis.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Mês */}
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Todos os meses</option>
            {mesesUnicos.map((m, i) => (
              <option key={i} value={m}>
                {nomesMeses[m - 1]}
              </option>
            ))}
          </select>

          {/* Ano */}
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Todos os anos</option>
            {anosUnicos.map((a, i) => (
              <option key={i} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Flag usar dataPagamento */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={usarDataPagamento}
            onChange={(e) => setUsarDataPagamento(e.target.checked)}
          />
          <label className="text-sm">Filtrar por data de pagamento</label>
        </div>
      </div>

      {/* ✅ Resumo APENAS dos filtrados */}
      <section className="bg-indigo-50 rounded-lg p-4 shadow space-y-2">
        <h3 className="text-lg font-semibold text-indigo-600">Resumo</h3>
        <p><strong>Receitas:</strong> R$ {totalReceitas.toFixed(2)}</p>
        <p><strong>Despesas:</strong> R$ {totalDespesas.toFixed(2)}</p>
        <p className={saldo >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          Saldo: R$ {saldo.toFixed(2)}
        </p>
      </section>

      {/* Lista filtrada */}
      <section className="bg-white rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold text-indigo-600 mb-2">Lançamentos</h3>
        {filtrados.length === 0 ? (
          <p className="text-gray-500">Nenhum lançamento encontrado.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtrados.map((l, i) => (
              <li key={i} className="flex justify-between py-2 text-sm">
                <span>
                  {(usarDataPagamento ? l.dataPagamento : l.data)} - {l.categoria}
                </span>
                <span className={l.tipo === "receita" ? "text-green-600" : "text-red-600"}>
                  R$ {l.valor}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}