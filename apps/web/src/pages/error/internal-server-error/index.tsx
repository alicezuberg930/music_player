import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
// 
import { Typography } from '@yukikaze/ui/typography'
import { Button } from '@yukikaze/ui/button'
// components
import { MotionContainer, varBounce } from '../../../components/animate'
// assets
import { SeverErrorIllustration } from '@/lib/illustrations'

const InternalServerErrorPage: React.FC = () => {
  return (
    <>
      <MotionContainer className='content-center h-screen text-center'>
        <m.div variants={varBounce().in}>
          <Typography variant="h3">
            Sorry, our server is currently having some issue!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography style={{ color: 'gray' }}>
            Sorry, our server is currently encountering some problem. Please try again later.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration
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
export default InternalServerErrorPage