import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
// 
import { Typography } from '@yukikaze/ui/typography'
import { Button } from '@yukikaze/ui/button'
// components
import { MotionContainer, varBounce } from '../../../components/animate'
// assets
import { ComingSoonIllustration } from '@/lib/illustrations'

const ComingSoonPage: React.FC = () => {
  return (
    <>
      <MotionContainer className='content-center h-screen text-center'>
        <m.div variants={varBounce().in}>
          <Typography variant="h3">
            This page is under construction!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography style={{ color: 'gray' }}>
            Sorry, we are currently developing this functionality. Please wait until we finish deploying it.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ComingSoonIllustration
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
export default ComingSoonPage