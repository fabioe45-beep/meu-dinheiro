import React from "react";

export default function Lancamentos({ lancamentos, excluirLancamento }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Lançamentos</h2>

      {lancamentos.length === 0 && (
        <p className="text-sm text-gray-600">Nenhum lançamento registrado.</p>
      )}

      <div className="space-y-3">
        {lancamentos.map((lan, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <span className="font-semibold">{lan.descricao}</span> —{" "}
              <span
                className={
                  lan.tipo.toLowerCase() === "receita"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                R$ {Number(lan.valor).toFixed(2)}
              </span>
              <div className="text-sm text-gray-500">
                {lan.categoria} • {lan.formaPagamento} • {lan.data}
              </div>
            </div>

            <button
              onClick={() => excluirLancamento(index)}
              className="rounded-full h-8 px-3 bg-white/10 text-red-600 hover:bg-white/30"
              title="Excluir lançamento"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}