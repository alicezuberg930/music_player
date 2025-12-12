import { MoveLeft, MoveRight } from '@yukikaze/ui/icons'
import { useCallback, useEffect, useState } from "react"
import { LazyLoadImage } from '@/components/lazy-load-image'
import { useIsMobile } from '@/hooks/useMobile'
import type { Banner } from '@/@types/banner'

type Props = {
    banners: Banner[]
}

let interval: number | undefined

const BannerSliderSection: React.FC<Props> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAuto, setIsAuto] = useState(true)
    const isMobile = useIsMobile()

    const totalBanners = banners?.length || 0
    const displayCount = isMobile ? 2 : 3

    const getVisibleIndices = (startIndex: number): number[] => {
        if (totalBanners === 0) return []
        if (totalBanners <= displayCount) {
            return Array.from({ length: totalBanners }, (_, i) => i)
        }
        const indices: number[] = []
        for (let i = 0; i < displayCount; i++) {
            indices.push((startIndex + i) % totalBanners)
        }
        return indices
    }

    const handleNext = useCallback(() => {
        if (totalBanners <= displayCount) return
        setCurrentIndex((prev) => (prev + 1) % totalBanners)
    }, [totalBanners, displayCount])

    const handlePrevious = useCallback(() => {
        if (totalBanners <= displayCount) return
        setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners)
    }, [totalBanners, displayCount])

    const clickNextBanner = useCallback(() => {
        interval && clearInterval(interval)
        setIsAuto(false)
        handleNext()
    }, [handleNext])

    const clickPreviousBanner = useCallback(() => {
        interval && clearInterval(interval)
        setIsAuto(false)
        handlePrevious()
    }, [handlePrevious])

    useEffect(() => {
        console.log(isAuto)
        if (isAuto && totalBanners > displayCount) {
            interval = setInterval(() => {
                handleNext()
            }, 4000)
        }
        return () => {
            interval && clearInterval(interval)
        }
    }, [isAuto, totalBanners, handleNext, displayCount])

    const visibleIndices = getVisibleIndices(currentIndex)

    if (!banners || totalBanners === 0) return null

    return (
        <section
            className="flex justify-between gap-4 w-full overflow-hidden relative mt-12"
            aria-label="Featured banners carousel"
            onMouseEnter={() => setIsAuto(false)}
            onMouseLeave={() => setIsAuto(true)}
        >
            {totalBanners > displayCount && (
                <button
                    className="rounded-full p-2 z-30 absolute top-1/2 -translate-y-[50%] left-2 bg-[rgba(0,0,0,.5)] text-white hover:bg-[rgba(0,0,0,.7)] transition-colors"
                    onClick={clickPreviousBanner}
                    aria-label="Previous banner"
                >
                    <MoveLeft size={isMobile ? 12 : 24} />
                </button>
            )}

            <div className="flex gap-4 w-full transition-all duration-500">
                {visibleIndices.map((index, position) => {
                    const banner = banners[index]
                    return (
                        <div
                            key={`${banner?.id}-${currentIndex}-${position}`}
                            className={`flex-1 ${position === 0 ? 'animate-slide-left' : position === displayCount - 1 ? 'animate-slide-right' : 'animate-slide-left-2'}`}
                        >
                            <LazyLoadImage
                                widths={[
                                    { screenWidth: 1024, imageWidth: 350 },  // Tablet & Phone
                                    { screenWidth: 1920, imageWidth: 700 },  // Desktop and larger
                                ]}
                                wrapperClassName="aspect-video w-full"
                                src={banner?.thumbnail}
                                alt={banner?.name || `Banner ${position + 1}`}
                                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            />
                        </div>
                    )
                })}
            </div>

            {totalBanners > displayCount && (
                <button
                    className="rounded-full p-2 z-30 absolute top-1/2 -translate-y-[50%] right-2 bg-[rgba(0,0,0,.5)] text-white hover:bg-[rgba(0,0,0,.7)] transition-colors"
                    onClick={clickNextBanner}
                    aria-label="Next banner"
                >
                    <MoveRight size={isMobile ? 12 : 24} />
                </button>
            )}
        </section>
    )
}

export default BannerSliderSection