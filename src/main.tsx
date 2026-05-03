import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Asegúrate de tener tu archivo index.css de Tailwind

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);