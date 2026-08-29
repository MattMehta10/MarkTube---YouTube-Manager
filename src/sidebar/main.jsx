import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Extension iframe root selector ('mt-sidebar-root') with fallback to standard local Vite dev root ('root')
const rootEl = document.getElementById('mt-sidebar-root') || document.getElementById('root');

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('[MarkTube] Neither #mt-sidebar-root nor #root found — check DOM target');
}

/* 
// =========================================================================
// OPTIONAL: Dedicated local dev server mount block for npm run dev testing
// =========================================================================
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
*/
