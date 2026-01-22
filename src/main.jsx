import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './custom-scrollbar.css'  // ⭐ ADD THIS LINE
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)