import './index.css'
// i18n
import './lib/locales/i18n.ts'
// redux provider config
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.ts'
// authentication provider
import { AuthProvider } from './providers/auth-provider.tsx'
import { QueryClientProvider } from './providers/query-client-provider.tsx'
// theme provider
import { ThemeProvider } from '@yukikaze/ui'
// snackbar
import { Toaster } from '@yukikaze/ui/sonner'
// 
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(document.getElementById('root') as HTMLElement,
  <StrictMode>
    <QueryClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="default"
        themes={['default', 'red', 'blue', 'green']}
        disableTransitionOnChange
      >
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <AuthProvider>
                <App />
                <Toaster />
              </AuthProvider>
            </BrowserRouter>
          </PersistGate>
        </ReduxProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)