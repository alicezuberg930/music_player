import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
// 
import { Typography } from '@yukikaze/ui/typography'
import { Button } from '@yukikaze/ui/button'
// components
import { MotionContainer, varBounce } from '../components/animate'
// assets
import { PageNotFoundIllustration } from '@/lib/illustrations'

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <MotionContainer className='content-center h-screen text-center'>
        <m.div variants={varBounce().in}>
          <Typography variant="h3">
            Sorry, page not found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography style={{ color: 'gray' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration
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