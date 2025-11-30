import React, { useState } from "react";

export default function NovoPlanejamento({
  adicionarPlanejamento,
  setScreen,
  categoriasReceita,
  categoriasDespesa,
  adicionarCategoria,
}) {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [replicarAno, setReplicarAno] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [novoItem, setNovoItem] = useState({ nome: "", valor: 0 });

  // ✅ sempre com 2 casas decimais
  const somaReceitas = receitas.reduce(
    (acc, r) => acc + Number(parseFloat(r.valor || 0).toFixed(2)),
    0
  );
  const somaDespesas = despesas.reduce(
    (acc, d) =>
      acc +
      d.itens.reduce(
        (s, it) => s + Number(parseFloat(it.valor || 0).toFixed(2)),
        0
      ),
    0
  );

  const disponivel = somaReceitas - somaDespesas;

  const adicionarReceita = () =>
    setReceitas([
      ...receitas,
      { categoria: categoriasReceita[0] || "", valor: 0 },
    ]);

  const atualizarReceita = (index, campo, valor) => {
    const novas = [...receitas];
    // ✅ normaliza valor
    novas[index][campo] =
      campo === "valor" ? Number(parseFloat(valor).toFixed(2)) : valor;
    setReceitas(novas);
  };

  const adicionarDespesa = () =>
    setDespesas([
      ...despesas,
      { categoria: categoriasDespesa[0] || "", itens: [] },
    ]);

  const atualizarCategoriaDespesa = (index, valor) => {
    const novas = [...despesas];
    novas[index].categoria = valor;
    setDespesas(novas);
  };

  const abrirModalItens = (index) => {
    setCategoriaSelecionada(index);
    setShowModal(true);
  };

  const adicionarItem = () => {
    if (!novoItem.nome || !novoItem.valor) return;
    const novas = [...despesas];
    // ✅ normaliza valor do item
    novas[categoriaSelecionada].itens.push({
      ...novoItem,
      valor: Number(parseFloat(novoItem.valor).toFixed(2)),
    });
    setDespesas(novas);
    setNovoItem({ nome: "", valor: 0 });
  };

  const salvar = () => {
    const novo = {
      mes,
      ano,
      receitaTotal: Number(somaReceitas.toFixed(2)),
      despesasTotal: Number(somaDespesas.toFixed(2)),
      disponivel: Number(disponivel.toFixed(2)),
      receitas,
      despesas,
      replicarAno,
    };
    adicionarPlanejamento(novo);
    setScreen("planejamento");
  };

  const handleCategoriaChange = (index, valor, tipo) => {
    if (valor === "__nova__") {
      const entrada = prompt("Digite o nome da nova categoria:");
      const nova = entrada?.trim();
      if (!nova) return;

      if (tipo === "receita") {
        const existe = categoriasReceita.some(
          (c) => c.toLowerCase() === nova.toLowerCase()
        );
        if (existe) {
          alert("Essa categoria já existe.");
          return;
        }
        adicionarCategoria(nova, "receita");
        atualizarReceita(index, "categoria", nova);
      }

      if (tipo === "despesa") {
        const existe = categoriasDespesa.some(
          (c) => c.toLowerCase() === nova.toLowerCase()
        );
        if (existe) {
          alert("Essa categoria já existe.");
          return;
        }
        adicionarCategoria(nova, "despesa");
        atualizarCategoriaDespesa(index, nova);
      }
    } else {
      if (tipo === "receita") atualizarReceita(index, "categoria", valor);
      if (tipo === "despesa") atualizarCategoriaDespesa(index, valor);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full relative flex flex-col">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">
        Novo Planejamento
      </h2>

      {/* Área rolável */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Seletores */}
        <div className="flex gap-2 mb-4">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            {[new Date().getFullYear() - 1,
              new Date().getFullYear(),
              new Date().getFullYear() + 1].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Receitas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Categorias de Receita</h3>
          {receitas.map((r, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={r.categoria}
                onChange={(e) =>
                  handleCategoriaChange(i, e.target.value, "receita")
                }
                className="flex-1 p-2 border rounded"
              >
                {categoriasReceita.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__nova__">+ Nova categoria</option>
              </select>
              <input
                type="number"
                placeholder="Valor"
                value={r.valor}
                onChange={(e) =>
                  atualizarReceita(i, "valor", e.target.value)
                }
                className="w-24 p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={adicionarReceita}
            className="mt-2 bg-gradient-to-r from-green-500 to-green-300 text-white px-3 py-1 rounded"
          >
            + Receita
          </button>
          {/* ✅ exibe com 2 casas */}
          <p className="mt-2 font-semibold">
            Total Receita: R$ {somaReceitas.toFixed(2)}
          </p>
        </div>
                {/* Despesas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Categorias de Despesa</h3>
          {despesas.map((d, i) => {
            const totalCategoria = d.itens.reduce(
              (acc, it) => acc + Number(parseFloat(it.valor || 0).toFixed(2)),
              0
            );
            return (
              <div key={i} className="mb-4 border rounded p-2">
                <div className="flex gap-2 mb-2">
                  <select
                    value={d.categoria}
                    onChange={(e) =>
                      handleCategoriaChange(i, e.target.value, "despesa")
                    }
                    className="flex-1 p-2 border rounded"
                  >
                    {categoriasDespesa.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__nova__">+ Nova categoria</option>
                  </select>
                  <button
                    onClick={() => abrirModalItens(i)}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white px-3 py-1 rounded"
                  >
                    + Itens
                  </button>
                </div>
                {d.itens.length > 0 ? (
                  <ul className="ml-4 space-y-2">
                    {d.itens.map((it, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {it.nome} — R$ {Number(it.valor).toFixed(2)}
                        </span>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            const novas = [...despesas];
                            novas[i].itens = novas[i].itens.filter(
                              (_, j) => j !== idx
                            );
                            setDespesas(novas);
                          }}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 ml-2">Nenhum item adicionado.</p>
                )}
                <p className="mt-2 font-semibold">
                  Total: R$ {totalCategoria.toFixed(2)}
                </p>
              </div>
            );
          })}
          <button
            onClick={adicionarDespesa}
            className="mt-2 bg-gradient-to-r from-red-500 to-red-400 text-white px-3 py-1 rounded"
          >
            + Categoria de Despesa
          </button>
          <p className="mt-2 font-semibold">
            Total Despesa: R$ {somaDespesas.toFixed(2)}
          </p>
        </div>

        {/* ✅ Campo fixo Disponível */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Disponível</h3>
          <p
            className={`font-semibold ${
              disponivel >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            R$ {disponivel.toFixed(2)}
          </p>
        </div>

        {/* Flag replicar */}
        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              checked={replicarAno}
              onChange={(e) => setReplicarAno(e.target.checked)}
            />{" "}
            Replicar para todos os meses do ano
          </label>
        </div>
      </div>

      {/* Botão salvar fixo */}
      <button
        onClick={salvar}
        className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
      >
        Salvar Planejamento
      </button>

      {/* Modal de itens */}
      {showModal && categoriaSelecionada !== null && (
        <div className="fixed inset-0 bg-gray-500/05 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h3 className="text-lg font-bold mb-4">
              Itens — {despesas[categoriaSelecionada]?.categoria || "Categoria"}
            </h3>

            {/* Lista de itens atuais */}
            {despesas[categoriaSelecionada]?.itens?.length > 0 ? (
              <ul className="mb-4 space-y-2">
                {despesas[categoriaSelecionada].itens.map((it, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {it.nome} — R$ {Number(it.valor).toFixed(2)}
                    </span>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        const novas = [...despesas];
                        novas[categoriaSelecionada].itens =
                          novas[categoriaSelecionada].itens.filter(
                            (_, i) => i !== idx
                          );
                        setDespesas(novas);
                      }}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-4">Nenhum item adicionado ainda.</p>
            )}

            {/* Form de novo item */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nome do item"
                value={novoItem.nome}
                onChange={(e) =>
                  setNovoItem({ ...novoItem, nome: e.target.value })
                }
                className="flex-1 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Valor"
                value={novoItem.valor}
                onChange={(e) =>
                  setNovoItem({
                    ...novoItem,
                    valor: Number(parseFloat(e.target.value || 0).toFixed(2)),
                  })
                }
                className="w-28 p-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={adicionarItem}
                className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                Adicionar item
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCategoriaSelecionada(null);
                  setNovoItem({ nome: "", valor: 0 });
                }}
                className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}