import { useRef } from 'react'
import { SnackbarProvider as NotistackProvider, type SnackbarKey } from 'notistack'
import { Check, Info, OctagonAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
}

export default function SnackbarProvider({ children }: Props) {
  const notistackRef = useRef<NotistackProvider | null>(null)

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current?.closeSnackbar(key)
  }

  return (
    <>
      <NotistackProvider
        ref={notistackRef}
        dense
        maxSnack={5}
        preventDuplicate={false}
        autoHideDuration={3000}
        variant="success"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ backgroundColor: 'white', color: 'black' }}
        iconVariant={{
          info: <SnackbarIcon icon={<Info />} color="info" />,
          success: <SnackbarIcon icon={<Check />} color="success" />,
          warning: <SnackbarIcon icon={<OctagonAlert />} color="warning" />,
          error: <SnackbarIcon icon={<OctagonAlert />} color="error" />,
        }}
        action={(key) => (
          <X onClick={onClose(key)} size={24} />
        )}
      >
        {children}
      </NotistackProvider>
    </>
  )
}

type SnackbarIconProps = {
  icon: React.ReactNode
  color: 'info' | 'success' | 'warning' | 'error'
}

function SnackbarIcon({ icon, color }: SnackbarIconProps) {
  return (
    <div
      className={cn('mr-3 w-10 h-10 flex rounded-xl items-center justify-center',
        color === 'info' && 'text-blue-600 bg-blue-600/30',
        color === 'success' && 'text-green-600 bg-green-600/30',
        color === 'warning' && 'text-yellow-600 bg-yellow-600/30',
        color === 'error' && 'text-red-600 bg-red-600/30'
      )}
    >
      {icon}
    </div>
  )
}