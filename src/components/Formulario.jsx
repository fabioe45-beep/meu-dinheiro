import React, { useEffect, useState } from "react";

export default function Formulario({
  categoriasReceita = [],
  categoriasDespesa = [],
  adicionarLancamento,
  adicionarCategoria,
}) {
  const [tipo, setTipo] = useState("receita");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [usarMesSeguinte, setUsarMesSeguinte] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [qtdRepeticoes, setQtdRepeticoes] = useState(1);

  const categoriasAtuais = tipo === "receita" ? categoriasReceita : categoriasDespesa;

  // Define automaticamente a primeira categoria disponível quando tipo muda ou quando lista carrega
  useEffect(() => {
    if (!categoria && categoriasAtuais.length > 0) {
      setCategoria(categoriasAtuais[0]);
    }
  }, [tipo, categoriasAtuais]);

  const podeEnviar =
    descricao.trim() !== "" &&
    Number(valor) > 0 &&
    data &&
    categoria &&
    categoriasAtuais.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!podeEnviar) return;

    const dataObj = new Date(data);
    const v = Number(valor);

    // Caso 1: nenhum flag
    if (!usarMesSeguinte && !repetir) {
      adicionarLancamento({
        tipo,
        categoria,
        descricao: descricao.trim(),
        valor: v,
        data,
        dataPagamento: data,
      });
    }

    // Caso 2: só mês seguinte
    if (usarMesSeguinte && !repetir) {
      const dataPagamento = new Date(
        dataObj.getFullYear(),
        dataObj.getMonth() + 1,
        dataObj.getDate()
      )
        .toISOString()
        .split("T")[0];

      adicionarLancamento({
        tipo,
        categoria,
        descricao: descricao.trim(),
        valor: v,
        data,
        dataPagamento,
      });
    }

    // Caso 3: só repetir
    if (!usarMesSeguinte && repetir) {
      for (let i = 0; i < qtdRepeticoes; i++) {
        const dataPagamento = new Date(
          dataObj.getFullYear(),
          dataObj.getMonth() + i,
          dataObj.getDate()
        )
          .toISOString()
          .split("T")[0];

        adicionarLancamento({
          tipo,
          categoria,
          descricao: descricao.trim(),
          valor: v,
          data,
          dataPagamento,
          parcela: { atual: i + 1, total: qtdRepeticoes },
        });
      }
    }

    // Caso 4: mês seguinte + repetir
    if (usarMesSeguinte && repetir) {
      for (let i = 0; i < qtdRepeticoes; i++) {
        const dataPagamento = new Date(
          dataObj.getFullYear(),
          dataObj.getMonth() + 1 + i,
          dataObj.getDate()
        )
          .toISOString()
          .split("T")[0];

        adicionarLancamento({
          tipo,
          categoria,
          descricao: descricao.trim(),
          valor: v,
          data,
          dataPagamento,
          parcela: { atual: i + 1, total: qtdRepeticoes },
        });
      }
    }

    // limpa estados
    setDescricao("");
    setValor("");
    setData("");
    setUsarMesSeguinte(false);
    setRepetir(false);
    setQtdRepeticoes(1);
    // mantém categoria atual para acelerar lançamentos repetidos
  };

  const handleCategoriaChange = (e) => {
    if (e.target.value === "nova") {
      const nova = prompt("Digite o nome da nova categoria:");
      if (nova && nova.trim() !== "") {
        adicionarCategoria(nova.trim(), tipo);
        setCategoria(nova.trim());
      }
    } else {
      setCategoria(e.target.value);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Novo Lançamento</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setCategoria(""); // força reescolha ou auto-seleção
            }}
            className="w-full border rounded-lg p-2"
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={categoria}
            onChange={handleCategoriaChange}
            className="w-full border rounded-lg p-2"
          >
            {categoriasAtuais.length === 0 ? (
              <option value="">Cadastre uma categoria primeiro</option>
            ) : (
              <>
                {categoriasAtuais.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="nova">+ Nova Categoria</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Supermercado"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 150.00"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={usarMesSeguinte}
            onChange={(e) => setUsarMesSeguinte(e.target.checked)}
          />
          <label className="text-sm">Influenciar mês seguinte</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={repetir}
            onChange={(e) => setRepetir(e.target.checked)}
          />
          <label className="text-sm">Repetir</label>
          <input
            type="number"
            min="1"
            value={qtdRepeticoes}
            onChange={(e) => setQtdRepeticoes(Number(e.target.value))}
            className="w-20 border rounded-lg p-1"
          />
        </div>

        <button
          type="submit"
          disabled={!podeEnviar}
          className={`w-full text-white font-semibold py-2 rounded-lg shadow-md transition ${
            podeEnviar
              ? "bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Salvar Lançamento
        </button>
      </form>
    </div>
  );
}