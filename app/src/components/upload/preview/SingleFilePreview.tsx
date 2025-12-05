import { LazyLoadImage } from 'react-lazy-load-image-component'
import { type CustomFile } from '../types'
import { fileFormat, fileThumb } from '@/components/file-thumbnail'

type Props = {
  file: CustomFile | string | null
}

export default function SingleFilePreview({ file }: Props) {
  if (!file) return null
  let imgUrl = ''
  if (typeof file === 'string') {
    imgUrl = file
  } else {
    const format = fileFormat(file.path)
    imgUrl = format === 'image' ? file.preview! : fileThumb(format)
  }

  return (
    <LazyLoadImage
      alt='file preview'
      src={imgUrl}
      className='top-2 left-2 z-10 rounded-lg absolute w-[calc(100%-16px)] h-[calc(100%-16px)] object-fit'
    />
  )
}
