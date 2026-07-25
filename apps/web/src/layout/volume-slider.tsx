import { Volume1, Volume2, VolumeX } from "@yukikaze/ui"
import { Button } from "@yukikaze/ui/button"
import { memo, type Dispatch, type SetStateAction } from "react"
import type React from "react"

type VolumeSliderProps = {
    volume: number
    setVolume: Dispatch<SetStateAction<number>>
}

const VolumeSlider = ({ volume, setVolume }: VolumeSliderProps) => {
    const handleVolumeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        setVolume((currentVolume) => Math.min(100, Math.max(0, currentVolume + (e.key === 'ArrowRight' ? 5 : -5))))
    }

    const updateVolumeFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const nextVolume = Math.round(((e.clientX - rect.left) / rect.width) * 100)
        setVolume(Math.min(100, Math.max(0, nextVolume)))
    }

    return (
        <>
            <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={() => setVolume(volume === 0 ? 50 : 0)}
                aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
                {volume >= 50 ? (
                    <Volume2 />
                ) : volume === 0 ? (
                    <VolumeX />
                ) : (
                    <Volume1 />
                )}
            </Button>
            <div
                role='slider'
                tabIndex={0}
                aria-label='Volume'
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={volume}
                onKeyDown={handleVolumeKeyDown}
                onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId)
                    updateVolumeFromPointer(e)
                }}
                onPointerMove={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId)) updateVolumeFromPointer(e)
                }}
                className='relative h-2 w-24 lg:w-36 origin-left cursor-pointer touch-none rounded-full bg-neutral-500/50 transition-all group-hover:h-3'
            >
                <div
                    className='absolute inset-y-0 left-0 rounded-full bg-primary'
                    style={{ width: `${volume}%` }}
                />
                <div
                    className='absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary'
                    style={{ left: `${volume}%` }}
                />
            </div>
        </>
    )
}

export default memo(VolumeSlider)