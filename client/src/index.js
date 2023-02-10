import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// How to get Image optimally in client side?