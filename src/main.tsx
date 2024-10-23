import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>

      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </div>
  </StrictMode>,
)
