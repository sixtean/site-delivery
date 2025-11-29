import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './screens/App.tsx'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'leaflet/dist/leaflet.css';


import { initTheme } from './hooks/initTheme.ts';

initTheme();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
