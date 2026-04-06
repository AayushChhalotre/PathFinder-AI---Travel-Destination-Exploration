import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Diagnostic: Capture and log top-level errors that cause a blank screen.
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Startup] Uncaught Error:', { message, source, lineno, colno, error });
  // In production, we might want to alert if it's a critical initialization failure.
};

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('[Startup] Failed to render root:', error);
}
