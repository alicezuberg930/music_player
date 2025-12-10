import React from "react"

export const useIsInView = (ref: React.RefObject<HTMLElement | null>) => {
    const [isInView, setIsInView] = React.useState(false)

    React.useEffect(() => {
        if (!ref.current) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true)
                observer.disconnect()
            }
        }, {
            rootMargin: '50px', // Load images 50px before they enter viewport
            threshold: 0.01
        })

        observer.observe(ref.current)

        return () => {
            observer.disconnect()
        }
    }, [ref])

    return isInView
}