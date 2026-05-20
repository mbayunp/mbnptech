import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <SmoothScrollProvider>
        <App />
      </SmoothScrollProvider>
    </HelmetProvider>
  </React.StrictMode>,
)