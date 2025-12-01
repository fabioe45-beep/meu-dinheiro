import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Importa Tailwind
import { registerSW } from "./serviceWorkerRegistration"; // ✅ usa o mesmo nome

// ✅ chama a função
registerSW();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);