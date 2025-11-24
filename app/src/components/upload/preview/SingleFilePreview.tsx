import { LazyLoadImage } from 'react-lazy-load-image-component'
import { type CustomFile } from '../types'

type Props = {
  file: CustomFile | string | null
}

export default function SingleFilePreview({ file }: Props) {
  if (!file) return null
  const imgUrl = typeof file === 'string' ? file : file.preview

  return (
    <LazyLoadImage
      alt='file preview'
      src={imgUrl}
      className='top-2 left-2 z-10 rounded-2xl absolute w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover'
    />
  )
}
