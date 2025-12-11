// import ReactLightbox, { ViewCallbackProps } from 'yet-another-react-lightbox'
// import Zoom from 'yet-another-react-lightbox/plugins/zoom'
// import Video from 'yet-another-react-lightbox/plugins/video'
// import Captions from 'yet-another-react-lightbox/plugins/captions'
// import Slideshow from 'yet-another-react-lightbox/plugins/slideshow'
// import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
// import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
// import { useLightboxState } from 'yet-another-react-lightbox/core'
// import { LightBoxProps } from './types'
// import { ChevronLeftIcon, ChevronRightIcon, ClosedCaptionIcon, FullscreenIcon, PauseCircleIcon, PlayCircleIcon, ZoomInIcon, ZoomOutIcon } from '@yukikaze/ui/icons'
// import { Typography } from '../ui/Typography'
// // lightbox styles
// import 'yet-another-react-lightbox/styles.css';
// import 'yet-another-react-lightbox/plugins/captions.css';
// import 'yet-another-react-lightbox/plugins/thumbnails.css';
// import './styles.css'

// const ICON_SIZE = 24

// export default function Lightbox({
//   slides,
//   disabledZoom = false,
//   disabledVideo = false,
//   disabledTotal = false,
//   disabledCaptions = false,
//   disabledSlideshow = false,
//   disabledThumbnails = false,
//   disabledFullscreen = false,
//   onGetCurrentIndex,
//   ...other
// }: LightBoxProps) {
//   const totalItems = slides ? slides.length : 0

//   return (
//     <>
//       <ReactLightbox
//         slides={slides}
//         animation={{ swipe: 500 }}
//         carousel={{ finite: totalItems < 5 }}
//         controller={{ closeOnBackdropClick: true }}
//         plugins={getPlugins({
//           disabledZoom,
//           disabledVideo,
//           disabledCaptions,
//           disabledSlideshow,
//           disabledThumbnails,
//           disabledFullscreen,
//         })}
//         on={{
//           view: ({ index }: ViewCallbackProps) => {
//             if (onGetCurrentIndex) {
//               onGetCurrentIndex(index)
//             }
//           },
//         }}
//         toolbar={{
//           buttons: [
//             <DisplayTotal
//               key={0}
//               totalItems={totalItems}
//               disabledTotal={disabledTotal}
//               disabledCaptions={disabledCaptions}
//             />,
//             'close',
//           ],
//         }}
//         render={{
//           iconClose: () => <ClosedCaptionIcon width={ICON_SIZE} />,
//           iconZoomIn: () => <ZoomInIcon width={ICON_SIZE} />,
//           iconZoomOut: () => <ZoomOutIcon width={ICON_SIZE} />,
//           iconSlideshowPlay: () => <PlayCircleIcon width={ICON_SIZE} />,
//           iconSlideshowPause: () => <PauseCircleIcon width={ICON_SIZE} />,
//           iconPrev: () => <ChevronLeftIcon width={ICON_SIZE + 8} />,
//           iconNext: () => <ChevronRightIcon width={ICON_SIZE + 8} />,
//           iconExitFullscreen: () => <FullscreenIcon width={ICON_SIZE} />,
//           iconEnterFullscreen: () => <FullscreenIcon width={ICON_SIZE} />,
//         }}
//         {...other}
//       />
//     </>
//   )
// }

// export function getPlugins({
//   disabledZoom,
//   disabledVideo,
//   disabledCaptions,
//   disabledSlideshow,
//   disabledThumbnails,
//   disabledFullscreen,
// }: LightBoxProps) {
//   let plugins = [Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]

//   if (disabledThumbnails) {
//     plugins = plugins.filter((plugin) => plugin !== Thumbnails)
//   }
//   if (disabledCaptions) {
//     plugins = plugins.filter((plugin) => plugin !== Captions)
//   }
//   if (disabledFullscreen) {
//     plugins = plugins.filter((plugin) => plugin !== Fullscreen)
//   }
//   if (disabledSlideshow) {
//     plugins = plugins.filter((plugin) => plugin !== Slideshow)
//   }
//   if (disabledZoom) {
//     plugins = plugins.filter((plugin) => plugin !== Zoom)
//   }
//   if (disabledVideo) {
//     plugins = plugins.filter((plugin) => plugin !== Video)
//   }

//   return plugins
// }

// type DisplayTotalProps = {
//   totalItems: number
//   disabledTotal?: boolean
//   disabledCaptions?: boolean
// }

// export function DisplayTotal({ totalItems, disabledTotal, disabledCaptions }: DisplayTotalProps) {
//   const state = useLightboxState()

//   const { currentIndex } = state

//   if (disabledTotal) {
//     return null
//   }

//   return (
//     <Typography className={`yarl__button ${disabledCaptions ? 'content-center min-w-16' : 'pl-3 left-0 fixed'}`}>
//       <strong> {currentIndex + 1} </strong> / {totalItems}
//     </Typography>
//   )
// }