import React from "react";

export default function Formulario({ categorias, adicionarLancamento }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const tipo = e.target.tipo.value;
    const categoria = e.target.categoria.value;
    const descricao = e.target.descricao.value.trim();
    const formaPagamento = e.target.formaPagamento.value;
    const valor = parseFloat(e.target.valor.value); // ✅ conversão para número
    const data = e.target.data.value;

    // validações
    if (!descricao || isNaN(valor) || valor <= 0 || !data) return;

    const novoLancamento = {
      tipo,
      categoria,
      descricao,
      formaPagamento,
      valor, // já convertido em número
      data,
    };

    adicionarLancamento(novoLancamento);
    e.target.reset();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Novo Lançamento</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select name="tipo" className="w-full border rounded-lg p-2">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select name="categoria" className="w-full border rounded-lg p-2">
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
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
          <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
          <select name="formaPagamento" className="w-full border rounded-lg p-2">
            <option>Dinheiro</option>
            <option>Cartão de Crédito</option>
            <option>Cartão de Débito</option>
            <option>Pix</option>
            <option>Boleto</option>
          </select>
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