// Source - https://stackoverflow.com/a
// Posted by Pavel Šindelka
// Retrieved 2025-11-24, License - CC BY-SA 4.0
import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
    interface MotionProps extends OriginalMotionProps {
        className?: string;
    }
}

// GIF.js library types
interface GIFOptions {
    workers?: number
    quality?: number
    width?: number
    height?: number
    transparent?: number | string
    background?: string
    repeat?: number
    dither?: boolean
}

interface GIFFrame {
    delay: number
    copy?: boolean
    dispose?: number
}

declare class GIF {
    constructor(options?: GIFOptions)
    addFrame(canvas: HTMLCanvasElement | CanvasRenderingContext2D | ImageData, options?: GIFFrame): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    on(event: 'progress', callback: (progress: number) => void): void
    on(event: 'abort', callback: () => void): void
    render(): void
    abort(): void
}

declare global {
    interface Window {
        GIF: typeof GIF
    }
    
    var GIF: typeof GIF
}

export {}
