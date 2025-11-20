import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from "react-router-dom"
import { persistor, store } from './redux/store.ts';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './lib/auth/AuthProvider.tsx';

hydrateRoot(document.getElementById('root')!,
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>
)