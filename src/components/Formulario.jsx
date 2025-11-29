import React, { useState } from "react";

export default function Formulario({
  categoriasReceita = [],
  categoriasDespesa = [],
  adicionarLancamento,
  adicionarCategoria,
}) {
  const [tipo, setTipo] = useState("receita");
  const [categoria, setCategoria] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const descricao = e.target.descricao.value.trim();
    const valor = parseFloat(e.target.valor.value);
    const data = e.target.data.value;

    if (!descricao || isNaN(valor) || valor <= 0 || !data || !categoria) return;

    const dataObj = new Date(data);
    const usarMesSeguinte = e.target.usarMesSeguinte.checked;
    const repetir = e.target.repetir.checked;
    const quantidadeRepeticoes = repetir ? Number(e.target.qtdRepeticoes.value) : 1;

    // Caso 1: nenhum flag
    if (!usarMesSeguinte && !repetir) {
      adicionarLancamento({
        tipo,
        categoria,
        descricao,
        valor,
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
        descricao,
        valor,
        data,
        dataPagamento,
      });
    }

    // Caso 3: só repetir
    if (!usarMesSeguinte && repetir) {
      adicionarLancamento({
        tipo,
        categoria,
        descricao,
        valor,
        data,
        dataPagamento: data,
        parcela: { atual: 1, total: quantidadeRepeticoes },
      });

      for (let i = 1; i < quantidadeRepeticoes; i++) {
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
          descricao,
          valor,
          data,
          dataPagamento,
          parcela: { atual: i + 1, total: quantidadeRepeticoes },
        });
      }
    }

    // Caso 4: mês seguinte + repetir
    if (usarMesSeguinte && repetir) {
      const dataPagamentoInicial = new Date(
        dataObj.getFullYear(),
        dataObj.getMonth() + 1,
        dataObj.getDate()
      )
        .toISOString()
        .split("T")[0];

      adicionarLancamento({
        tipo,
        categoria,
        descricao,
        valor,
        data,
        dataPagamento: dataPagamentoInicial,
        parcela: { atual: 1, total: quantidadeRepeticoes },
      });

      for (let i = 2; i <= quantidadeRepeticoes; i++) {
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
          descricao,
          valor,
          data,
          dataPagamento,
          parcela: { atual: i, total: quantidadeRepeticoes },
        });
      }
    }

    e.target.reset();
    setCategoria("");
  };

  // Lista dinâmica de categorias
  const categoriasAtuais = tipo === "receita" ? categoriasReceita : categoriasDespesa;

  const handleCategoriaChange = (e) => {
    if (e.target.value === "nova") {
      const nova = prompt("Digite o nome da nova categoria:");
      if (nova && nova.trim() !== "") {
        adicionarCategoria(nova.trim(), tipo); // passa também o tipo
        setCategoria(nova.trim());
      } else {
        setCategoria(categoriasAtuais[0] || "");
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
            name="tipo"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setCategoria("");
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
            name="categoria"
            value={categoria}
            onChange={handleCategoriaChange}
            className="w-full border rounded-lg p-2"
          >
            {categoriasAtuais.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="nova">+ Nova Categoria</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <input
            name="descricao"
            type="text"
            placeholder="Ex: Supermercado"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor</label>
          <input
            name="valor"
            type="number"
            step="0.01"
            placeholder="Ex: 150.00"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input
            name="data"
            type="date"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="usarMesSeguinte" />
          <label className="text-sm">Influenciar mês seguinte</label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="repetir" />
          <label className="text-sm">Repetir</label>
          <input
            type="number"
            name="qtdRepeticoes"
            min="1"
            defaultValue="1"
            className="w-20 border rounded-lg p-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition"
        >
          Salvar Lançamento
        </button>
      </form>
    </div>
  );
}