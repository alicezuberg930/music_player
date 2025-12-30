import sharp from 'sharp'

export interface ResizeImageOptions {
    /**
     * Target width in pixels
     */
    width?: number

    /**
     * Target height in pixels
     */
    height?: number

    /**
     * Aspect ratio as string (e.g., "16:9", "4:3", "1:1")
     * If provided along with only width or height, calculates the missing dimension
     */
    aspectRatio?: string

    /**
     * Fit strategy for resizing
     * - 'cover': Crop to cover both dimensions (default)
     * - 'contain': Preserve aspect ratio, fit within dimensions
     * - 'fill': Ignore aspect ratio, stretch to fill
     * - 'inside': Preserve aspect ratio, resize to fit inside
     * - 'outside': Preserve aspect ratio, resize to fit outside
     */
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

    /**
     * Position for cropping when fit is 'cover'
     * Default: 'center'
     */
    position?: 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' | 'center'

    /**
     * Background color when fit is 'contain'
     * Default: transparent
     */
    background?: string | { r: number; g: number; b: number; alpha?: number }

    /**
     * Output format
     * Default: same as input
     */
    format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'tiff'

    /**
     * Quality for lossy formats (1-100)
     * Default: 80
     */
    quality?: number
}

/**
 * Parse aspect ratio string to decimal
 * @example parseAspectRatio("16:9") // returns 1.777...
 */
function parseAspectRatio(aspectRatio: string): number {
    const [width, height] = aspectRatio.split(':').map(Number)
    if (!width || !height || width <= 0 || height <= 0)
        throw new Error(`Invalid aspect ratio: ${aspectRatio}`)
    return width / height
}

/**
 * Calculate dimensions based on aspect ratio
 */
function calculateDimensions(
    width?: number,
    height?: number,
    aspectRatio?: string
): { width?: number; height?: number } {
    if (!aspectRatio) return { width, height }

    const ratio = parseAspectRatio(aspectRatio)

    if (width && !height)
        return { width, height: Math.round(width / ratio) }

    if (height && !width)
        return { width: Math.round(height * ratio), height }

    return { width, height }
}

/**
 * Resize image using Sharp with flexible options
 * 
 * @param input - Buffer, file path, or Sharp instance
 * @param options - Resize options
 * @returns Sharp instance for further chaining
 * 
 * @example
 * // Resize to specific width and height
 * await resizeImage('input.jpg', { width: 800, height: 600 }).toFile('output.jpg')
 * 
 * @example
 * // Resize with aspect ratio (16:9) and width only
 * await resizeImage(buffer, { width: 1920, aspectRatio: '16:9' }).toBuffer()
 * 
 * @example
 * // Resize to square with cover fit
 * await resizeImage('input.jpg', { width: 500, height: 500, fit: 'cover' }).toFile('square.jpg')
 * 
 * @example
 * // Resize with aspect ratio and contain fit
 * await resizeImage('input.jpg', { 
 *   width: 800, 
 *   aspectRatio: '4:3', 
 *   fit: 'contain',
 *   background: { r: 255, g: 255, b: 255 }
 * }).toFile('output.jpg')
 */
export function resizeImage(
    input: string | Buffer | sharp.Sharp,
    options: ResizeImageOptions
): sharp.Sharp {
    const {
        width,
        height,
        aspectRatio,
        fit = 'cover',
        position = 'center',
        background,
        format = 'webp',
        quality = 100
    } = options

    const dimensions = calculateDimensions(width, height, aspectRatio)

    let image: sharp.Sharp
    if (typeof input === 'string' || Buffer.isBuffer(input)) {
        image = sharp(input)
    } else {
        image = input
    }

    image = image.resize({
        width: dimensions.width,
        height: dimensions.height,
        fit,
        position,
        background: background || { r: 0, g: 0, b: 0, alpha: 0 }
    })

    switch (format) {
        case 'jpeg':
            image = image.jpeg({ quality })
            break
        case 'png':
            image = image.png({ quality })
            break
        case 'webp':
            image = image.webp({ quality })
            break
        case 'avif':
            image = image.avif({ quality })
            break
        case 'gif':
            image = image.gif()
            break
        case 'tiff':
            image = image.tiff({ quality })
            break
    }

    return image
}

export async function resizeImageToFile(input: string | Buffer, output: string, options: ResizeImageOptions): Promise<sharp.OutputInfo> {
    return resizeImage(input, options).toFile(output)
}

export async function resizeImageToBuffer(input: string | Buffer, options: ResizeImageOptions): Promise<Buffer> {
    return resizeImage(input, options).toBuffer()
}
