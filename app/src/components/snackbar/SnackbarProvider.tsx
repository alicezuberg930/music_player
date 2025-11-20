import { useRef } from 'react'
import { SnackbarProvider as NotistackProvider, type SnackbarKey } from 'notistack'
import { Check, Info, OctagonAlert, X } from 'lucide-react'

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
        preventDuplicate
        autoHideDuration={3000}
        variant="success"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        iconVariant={{
          info: <SnackbarIcon icon={<Info color="info" />} color="info" />,
          success: <SnackbarIcon icon={<Check color="success" />} color="success" />,
          warning: <SnackbarIcon icon={<OctagonAlert color="warning" />} color="warning" />,
          error: <SnackbarIcon icon={<OctagonAlert color="warning" />} color="error" />,
        }}
        action={(key) => (
          <X onClick={onClose(key)} className='p-2' />
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
      style={{
        marginRight: 12,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}`,
        backgroundColor: `${color}`,
      }}
    >
      {icon}
    </div>
  )
}