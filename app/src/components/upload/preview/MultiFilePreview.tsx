import { m, AnimatePresence } from 'framer-motion'
// utils
import { fData } from '@/lib/formatNumber'
//
import { varFade } from '@/components/animate'
import FileThumbnail, { fileData } from '@/components/file-thumbnail'
//
import { type UploadProps } from '../types'
import { CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

export default function MultiFilePreview({ thumbnail, files, onRemove }: UploadProps) {
  if (!files?.length) return null

  return (
    <AnimatePresence initial={false}>
      {files.map((file) => {
        const { key, name = '', size = 0 } = fileData(file)
        const isNotFormatFile = typeof file === 'string'

        if (thumbnail) {
          return (
            <m.div
              key={key}
              className='inline-flex items-center justify-center border border-border m-1 w-20 h-20 rounded-xl overflow-hidden relative'
              variants={varFade().inUp}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                imageProps={{ className: 'absolute' }}
                fileProps={{ className: 'absolute' }}
              />

              {onRemove && (
                <Button
                  size={'sm'} variant='ghost'
                  className='absolute top-1 right-1 rounded-full bg-black/30 hover:bg-black/50'
                  onClick={() => onRemove(file)}
                >
                  <CircleX size={16} />
                </Button>
              )}
            </m.div>
          )
        }

        return (
          <m.div
            key={key}
            className='inline-flex items-center my-2 px-2 py-1.5 border border-border rounded-lg'
            variants={varFade().inUp}
          >
            <FileThumbnail file={file} />

            <div className='grow min-w-0'>
              <Typography variant="caption" className='font-semibold text-ellipsis line-clamp-1 overflow-hidden'>
                {isNotFormatFile ? file : name}
              </Typography>

              <Typography variant='caption' className='text-gray-400'>
                {isNotFormatFile ? '' : fData(size)}
              </Typography>
            </div>

            {onRemove && (
              <Button
                size={'sm'} variant='ghost'
                className='bg-black/30 hover:bg-black/50'
                onClick={() => onRemove(file)}
              >
                <CircleX size={16} />
              </Button>
            )}
          </m.div>
        )
      })}
    </AnimatePresence>
  )
}