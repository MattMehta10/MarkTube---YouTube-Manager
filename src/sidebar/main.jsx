import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootEl = document.getElementById('mt-sidebar-root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('[MarkTube] #mt-sidebar-root not found — sidebar HTML shell may be out of sync with this bundle');
}
