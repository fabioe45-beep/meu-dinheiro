import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Importa Tailwind
import { register as registerServiceWorker } from "./serviceWorkerRegistration";
import './index.css';
registerServiceWorker();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);