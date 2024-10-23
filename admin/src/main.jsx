import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CtxProvider } from './Context_CtrlPanel/Context_CtrlPanel.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CtxProvider>
        <App />
    </CtxProvider>
  </StrictMode>,
)
