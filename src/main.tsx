import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/inter';
import '@fontsource/instrument-serif/400-italic.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/diagram.css';
import './styles/home.css';
import './styles/project.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
