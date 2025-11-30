import React, { useState } from "react";

export default function EditarPlanejamento({
  planejamento,
  atualizarPlanejamento,
  setScreen,
  categoriasReceita,
  categoriasDespesa,
  adicionarCategoria,
}) {
  const [mes, setMes] = useState(planejamento.mes);
  const [ano, setAno] = useState(planejamento.ano);
  const [receitas, setReceitas] = useState(planejamento.receitas || []);
  const [despesas, setDespesas] = useState(planejamento.despesas || []);
  const [replicarAno, setReplicarAno] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [novoItem, setNovoItem] = useState({ nome: "", valor: 0 });

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

  const atualizarReceita = (index, campo, valor) => {
    const novas = [...receitas];
    novas[index][campo] =
      campo === "valor" ? Number(parseFloat(valor).toFixed(2)) : valor;
    setReceitas(novas);
  };

  const adicionarReceita = () =>
    setReceitas([
      ...receitas,
      { categoria: categoriasReceita[0] || "", valor: 0 },
    ]);

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
    novas[categoriaSelecionada].itens.push({
      ...novoItem,
      valor: Number(parseFloat(novoItem.valor).toFixed(2)),
    });
    setDespesas(novas);
    setNovoItem({ nome: "", valor: 0 });
  };

  const salvar = () => {
    const atualizado = {
      ...planejamento,
      mes,
      ano,
      receitaTotal: Number(somaReceitas.toFixed(2)),
      despesasTotal: Number(somaDespesas.toFixed(2)),
      disponivel: Number(disponivel.toFixed(2)),
      receitas,
      despesas,
      replicarAno,
    };
    atualizarPlanejamento(atualizado);
    setScreen("planejamento");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full relative flex flex-col">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">
        Editar Planejamento
      </h2>

      {/* Área rolável */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Receitas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Categorias de Receita</h3>
          {receitas.map((r, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={r.categoria}
                onChange={(e) =>
                  atualizarReceita(i, "categoria", e.target.value)
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
                onChange={(e) => atualizarReceita(i, "valor", e.target.value)}
                className="w-24 p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={adicionarReceita}
            className="mt-2 bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-1 rounded"
          >
            + Receita
          </button>
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
                    onChange={(e) => atualizarCategoriaDespesa(i, e.target.value)}
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
                      <li key={idx} className="flex items-center justify-between">
                        <span>
                          {it.nome} — R$ {Number(it.valor).toFixed(2)}
                        </span>
                        <button
                          className="text-red-600 font-bold hover:text-red-800"
                          onClick={() => {
                            const novas = [...despesas];
                            novas[i].itens = novas[i].itens.filter((_, j) => j !== idx);
                            setDespesas(novas);
                          }}
                        >
                          ×
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

        {/* Disponível */}
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
      </div>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setScreen("planejamento")}
          className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={salvar}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          Salvar Alterações
        </button>
      </div>

      {/* Modal de itens */}
      {showModal && categoriaSelecionada !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/05 bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h3 className="text-lg font-bold mb-4">
              Itens — {despesas[categoriaSelecionada]?.categoria}
            </h3>

            {despesas[categoriaSelecionada]?.itens?.length > 0 ? (
              <ul className="mb-4 space-y-2">
                {despesas[categoriaSelecionada].itens.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>
                      {it.nome} — R$ {Number(it.valor).toFixed(2)}
                    </span>
                    <button
                      className="text-red-600 font-bold hover:text-red-800"
                      onClick={() => {
                        const novas = [...despesas];
                        novas[categoriaSelecionada].itens =
                          novas[categoriaSelecionada].itens.filter((_, i) => i !== idx);
                        setDespesas(novas);
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-4">Nenhum item adicionado ainda.</p>
            )}

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Nome do item"
                value={novoItem.nome}
                onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
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