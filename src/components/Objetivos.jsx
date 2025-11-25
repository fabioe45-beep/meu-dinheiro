import React from "react";

export default function Objetivos({
  objetivos,
  categorias,
  adicionarObjetivo,
  excluirObjetivo,
  adicionarCategoria,
  excluirCategoria,
  showModal,
  setShowModal,
  modalType,
  setModalType,
}) {
  const btnBase =
    "rounded-full h-10 px-4 transition-all duration-300 bg-white/10 text-gray-900 hover:bg-white/30";
  const btnPrimary =
    "rounded-full h-10 px-4 transition-all duration-300 bg-white text-indigo-600 font-semibold shadow";
  const btnDanger =
    "rounded-full h-10 px-4 transition-all duration-300 bg-white/10 text-red-600 hover:bg-white/30";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800 w-full h-full relative overflow-visible">
      <h2 className="text-xl font-bold text-indigo-600 mb-4">Objetivos Mensais</h2>

      <div className="space-y-3">
        {objetivos.length === 0 && (
          <p className="text-sm text-gray-600">Nenhuma meta definida ainda.</p>
        )}

        {objetivos.map((obj, index) => (
          <div
            key={`${obj.categoria}-${index}`}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{obj.categoria}</span>
            <div className="flex items-center gap-3">
              <span>Meta: R$ {obj.meta}</span>
              <button
                onClick={() => excluirObjetivo(index)}
                className={btnDanger}
                title="Excluir objetivo"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão flutuante azul gradiente com + enorme */}
      <button
        onClick={() => {
          setModalType("objetivo");
          setShowModal(true);
        }}
        className="absolute bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center shadow-lg ring-1 ring-white/40 text-white text-20xl font-bold"
        style={{
          backgroundImage: "linear-gradient(to right, #4f46e5, #9333ea)", // gradiente azul → roxo
          lineHeight: "1", // garante centralização vertical
        }}
        aria-label="Adicionar objetivo"
        title="Adicionar objetivo"
      >
        +
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-gray-800 shadow-xl">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "objetivo" ? "Novo Objetivo" : "Gerenciar Categorias"}
            </h3>

            {modalType === "objetivo" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const categoria = e.target.categoria.value.trim();
                  const meta = parseFloat(e.target.meta.value);
                  if (!categoria || isNaN(meta) || meta <= 0) return;
                  adicionarObjetivo({ categoria, meta });
                  setShowModal(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-1">Categoria</label>
                  <select name="categoria" className="w-full border rounded-lg p-2">
                    {categorias.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Meta (R$)</label>
                  <input
                    type="number"
                    name="meta"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setModalType("categorias")}
                    className={btnBase}
                  >
                    Gerenciar categorias
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className={btnBase}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className={btnPrimary}>
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const nome = e.target.nome.value.trim();
                    if (!nome) return;
                    adicionarCategoria(nome);
                    e.target.reset();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nova categoria"
                    className="flex-1 border rounded-lg p-2"
                  />
                  <button type="submit" className={btnPrimary}>
                    Adicionar
                  </button>
                </form>

                <ul className="space-y-2">
                  {categorias.map((cat, index) => (
                    <li
                      key={cat}
                      className="flex justify-between items-center border-b py-1"
                    >
                      <span>{cat}</span>
                      <button
                        onClick={() => excluirCategoria(index)}
                        className={btnDanger}
                        title="Excluir categoria"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType("objetivo")}
                    className={btnBase}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={btnBase}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}