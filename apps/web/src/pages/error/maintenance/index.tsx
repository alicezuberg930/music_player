import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
// 
import { Typography } from '@yukikaze/ui/typography'
import { Button } from '@yukikaze/ui/button'
// components
import { MotionContainer, varBounce } from '../../../components/animate'
// assets
import { MaintenanceIllustration } from '@/lib/illustrations'

const NotFoundPage: React.FC = () => {
  return (
    <>
      <MotionContainer className='content-center h-screen text-center'>
        <m.div variants={varBounce().in}>
          <Typography variant="h3">
            Sorry, the website is under maintenance!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography style={{ color: 'gray' }}>
            Sorry, we are currently under maintenance. Please wait for a moment before the website come online again.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <MaintenanceIllustration
            style={{
              height: 260,
              marginTop: 30,
              marginBottom: 30,
            }}
          />
        </m.div>

        <Button>
          <RouterLink to="/">
            Go to Home
          </RouterLink>
        </Button>
      </MotionContainer>
    </>
  )
}
export default NotFoundPage