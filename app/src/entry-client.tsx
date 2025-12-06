import './index.css'
// lazy load image css
import 'react-lazy-load-image-component/src/effects/blur.css'
// i18n
import './lib/locales/i18n.ts'
// redux provider config
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store.ts'
// snackbar provider
import SnackbarProvider from './components/snackbar/SnackbarProvider.tsx'
// authentication provider
import { AuthProvider } from './lib/auth/AuthProvider.tsx'
// react query provider
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './lib/queryClient.ts'
// 
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

hydrateRoot(document.getElementById('root') as HTMLElement,
  <StrictMode>
    <QueryClientProvider client={getQueryClient()}>
      <SnackbarProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </PersistGate>
        </ReduxProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
)