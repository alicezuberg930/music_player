import { MoveLeft, MoveRight } from '@yukikaze/ui/icons'
import { useCallback, useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"

let interval: number | undefined

const BannerSliderSection: React.FC = () => {
    const banners: any = []
    // const navigate = useNavigate()
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(2)
    const [isAuto, setIsAuto] = useState(true)

    const getArrSlider = (start: number, end: number, length: number) => {
        const limit = (start > end) ? length : end
        let output = []
        for (let i = start; i <= limit; i++) {
            output.push(i)
        }
        if (start > end) {
            for (let i = 0; i <= end; i++) {
                output.push(i)
            }
        }
        return output
    }

    const handleClickBanner = (item: any) => {
        console.log(item)
    }

    const handleBannerAnimation = (step: number) => {
        const slider = document.getElementsByClassName('slider-item') as HTMLCollectionOf<HTMLElement>
        const list = getArrSlider(min, max, slider.length - 1)
        for (let i = 0; i < slider.length; i++) {
            // reset animations from the images
            slider[i].classList.remove('animate-slide-right', 'order-last', 'z-20')
            slider[i].classList.remove('animate-slide-left', 'order-first', 'z-10')
            slider[i].classList.remove('animate-slide-left-2', 'order-2', 'z-10')
            // show image within min and max range and hide image outside of that range
            if (list.some(item => item === i)) {
                slider[i].style.display = 'block'
            } else {
                slider[i].style.display = 'none'
            }
        }
        // add animation for the images (the first one to most right and the 2nd and 3rd to left)
        list.forEach(item => {
            if (item === max) {
                slider[item].classList.add('animate-slide-right', 'order-last', 'z-20')
            } else if (item === min) {
                slider[item].classList.add('animate-slide-left', 'order-first', 'z-10')
            } else {
                slider[item].classList.add('animate-slide-left-2', 'order-2', 'z-10')
            }
        })
        if (step === 1) {
            setMin(prev => prev === slider.length - 1 ? 0 : prev + step)
            setMax(prev => prev === slider.length - 1 ? 0 : prev + step)
        }
        if (step === -1) {
            setMin(prev => prev === 0 ? slider.length - 1 : prev + step)
            setMax(prev => prev === 0 ? slider.length - 1 : prev + step)
        }
    }

    const clickPreviousBanner = useCallback((step: number) => {
        interval && clearInterval(interval)
        setIsAuto(false)
        handleBannerAnimation(step)
    }, [min, max])


    const clickNextBanner = useCallback((step: number) => {
        interval && clearInterval(interval)
        setIsAuto(false)
        handleBannerAnimation(step)
    }, [min, max])

    useEffect(() => {
        if (isAuto) {
            interval = setInterval(() => {
                handleBannerAnimation(1)
            }, 4000)
        }
        return () => {
            interval && clearInterval(interval)
        }
    }, [min, max, isAuto])

    return (
        <div className="flex justify-between gap-4 w-full overflow-hidden relative" onMouseLeave={() => setIsAuto(true)}>
            <button className="rounded-full p-3 z-30 absolute top-1/2 -translate-y-[50%] left-2 bg-[rgba(255,255,255,0.3)] text-white"
                onClick={() => clickPreviousBanner(1)}
            >
                <MoveLeft size={30} />
            </button>
            {
                banners?.map((item: any, index: number) => {
                    return (
                        <img key={item.encodeId} src={item.banner} alt="banner"
                            onClick={() => handleClickBanner(item)}
                            className={`slider-item flex-1 object-cover w-1/3 aspect-video rounded-lg ${index <= 2 ? 'block' : 'hidden'}`}
                        />
                    )
                })
            }
            <button className="rounded-full p-3 z-30 absolute top-1/2 -translate-y-[50%] right-2 bg-[rgba(255,255,255,0.3)] text-white"
                onClick={() => clickNextBanner(-1)}
            >
                <MoveRight size={30} />
            </button>
        </div>
    )
}

export default BannerSliderSection