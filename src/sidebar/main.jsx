import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global polyfill for PouchDB / Node modules in browser dev server
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

// Selector supporting both Extension iframe root ('mt-sidebar-root') and Local Dev server root ('root')
const rootEl = document.getElementById('mt-sidebar-root') || document.getElementById('root');

if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('[MarkTube] Neither #mt-sidebar-root nor #root found in DOM');
}
