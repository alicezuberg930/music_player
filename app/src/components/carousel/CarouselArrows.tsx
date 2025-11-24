// import React from 'react'
// import { cn } from '@/lib/utils'
// import { LeftIcon, RightIcon } from './Icon'
// import { Button, ButtonProps } from '../ui/Button'
// import { LucideProps } from 'lucide-react'


// interface Props {
//   shape?: 'circular' | 'rounded'
//   filled?: boolean
//   children?: React.ReactNode
//   onNext?: VoidFunction
//   onPrevious?: VoidFunction
//   leftButtonProps?: ButtonProps
//   rightButtonProps?: ButtonProps
//   className?: string
//   iconProps?: LucideProps
// }

// export default function CarouselArrows({
//   shape = 'circular',
//   filled = false,
//   onNext,
//   onPrevious,
//   children,
//   leftButtonProps,
//   rightButtonProps,
//   className,
//   iconProps,
//   ...other
// }: Props) {
//   const hasChildren = !!children

//   const baseButtonClasses = cn(
//     'transition-all duration-150 text-inherit p-1 md:px-4 md:py-2',
//     shape === 'rounded' ? 'rounded-lg' : 'rounded-full',
//     !filled ? 'opacity-50 hover:opacity-100' : 'text-white bg-gray-900/50 hover:bg-gray-900'
//   )

//   const leftButtonClasses = cn(
//     baseButtonClasses,
//     leftButtonProps?.className,
//     hasChildren && 'absolute top-1/2 -translate-y-1/2 z-10'
//   )

//   const rightButtonClasses = cn(
//     baseButtonClasses,
//     rightButtonProps?.className,
//     hasChildren && 'absolute top-1/2 -translate-y-1/2 z-10'
//   )

//   if (hasChildren) {
//     return (
//       <div className={cn('relative', className)} {...other}>
//         <Button
//           className={cn(leftButtonClasses, "left-4 md:left-12")}
//           onClick={onPrevious}
//           type="button"
//           {...leftButtonProps}
//         >
//           <LeftIcon {...iconProps} />
//         </Button>
//         {children}
//         <Button
//           className={cn(rightButtonClasses, "right-4 md:right-12")}
//           onClick={onNext}
//           type="button"
//           {...rightButtonProps}
//         >
//           <RightIcon {...iconProps} />
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div
//       className={cn('items-center inline-flex gap-2', className)}
//       {...other}
//     >
//       <Button
//         className={leftButtonClasses}
//         onClick={onPrevious}
//         type="button"
//         {...leftButtonProps}
//       >
//         <LeftIcon />
//       </Button>

//       <Button
//         className={rightButtonClasses}
//         onClick={onNext}
//         type="button"
//         {...rightButtonProps}
//       >
//         <RightIcon />
//       </Button>
//     </div>
//   )
// }