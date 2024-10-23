import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import TiendaContextProvider from './Context/TiendaContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TiendaContextProvider>
        <App />
    </TiendaContextProvider>
);
