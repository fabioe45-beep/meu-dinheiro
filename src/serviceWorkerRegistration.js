// src/serviceWorkerRegistration.js
export function registerSW() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/meu-dinheiro/service-worker.js") // ✅ precisa estar em public/
        .then((registration) => {
          console.log("✅ Service Worker registrado com sucesso:", registration);
        })
        .catch((error) => {
          console.error("❌ Erro ao registrar Service Worker:", error);
        });
    });
  }
}