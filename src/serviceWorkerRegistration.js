// src/serviceWorkerRegistration.js

// Esse código registra o service worker para transformar seu app em PWA
export function register() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
          console.error("Erro ao registrar Service Worker:", error);
        });
    });
  }
}