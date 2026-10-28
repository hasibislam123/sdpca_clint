import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './auth/AuthProvider'
import ContentProvider from './content/ContentProvider'
import LanguageProvider from './i18n/LanguageProvider'
import ThemeProvider from './theme/ThemeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
)
