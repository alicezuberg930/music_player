// import { cn } from '@yukikaze/ui';
// import React from 'react';

// // ----------------------------------------------------------------------

// type Props = {
//   className?: string;
// };

// const baseUlClasses = `p-0 flex items-center justify-center text-blue-500 [&>li]:w-4 [&>li]:h-4 md:[&>li]:w-8 md:[&>li]:h-8 [&>li]:opacity-50 [&>li]:flex [&>li]:items-center [&>li]:justify-center [&>li]:cursor-pointer [&>li.slick-active]:opacity-100 [&>li.slick-active>div>span]:shadow-carousel-dot`;

// export default function CarouselDots({ className }: Props) {
//   const ulClassName = cn(
//     baseUlClasses,
//     className
//   );

//   return {
//     appendDots: (dots: React.ReactNode) => (
//       <>
//         <ul className={ulClassName}>
//           {dots}
//         </ul>
//       </>
//     ),
//     customPaging: () => (
//       <div className="flex items-center justify-center w-full h-full z-50 dot">
//         <span className="bg-info w-2 h-2 md:w-4 md:h-4 rounded-full transition-all ease-in-out duration-200" />
//       </div>
//     ),
//   };
// }