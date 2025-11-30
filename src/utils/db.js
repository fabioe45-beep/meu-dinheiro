// db.js
import { openDB } from "idb";

export async function getDB() {
  return openDB("planejamentosDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("categoriasReceita")) {
        db.createObjectStore("categoriasReceita");
      }
      if (!db.objectStoreNames.contains("categoriasDespesa")) {
        db.createObjectStore("categoriasDespesa");
      }
      if (!db.objectStoreNames.contains("objetivos")) {
        db.createObjectStore("objetivos");
      }
      if (!db.objectStoreNames.contains("lancamentos")) {
        db.createObjectStore("lancamentos");
      }
      if (!db.objectStoreNames.contains("planejamentos")) {
        db.createObjectStore("planejamentos");
      }
    },
  });
}

export async function salvar(store, dados) {
  const db = await getDB();
  await db.put(store, dados, "data");
}

export async function carregar(store, fallback = []) {
  const db = await getDB();
  const dados = await db.get(store, "data");
  return dados || fallback;
}