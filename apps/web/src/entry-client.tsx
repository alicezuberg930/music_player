import './styles/index.css'
// i18n
import './lib/locales/i18n'
// redux configs
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
// providers
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from './routes'
import { ThemeProvider } from '@yukikaze/ui'
import { SocketProvider } from './providers/socket-provider'
import { NotificationProvider } from './providers/notification-provider'
import { AuthProvider } from './providers/auth-provider'
import { QueryClientProvider } from './providers/query-client-provider'
// toast
import { Toaster } from '@yukikaze/ui/sonner'
// 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SongOptionsDropdown from './layout/song-options-dropdown.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='default'
        themes={['default', 'red', 'blue', 'green']}
        disableTransitionOnChange
      >
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor}>
            <AuthProvider>
              <NotificationProvider>
                <SocketProvider>
                  <Router />
                  <Toaster />
                </SocketProvider>
              </NotificationProvider>
            </AuthProvider>
          </PersistGate>
        </ReduxProvider>
      </ThemeProvider>
      <SongOptionsDropdown />
    </QueryClientProvider>
  </StrictMode>
)
