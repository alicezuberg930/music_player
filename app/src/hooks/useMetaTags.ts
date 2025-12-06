import { useEffect } from 'react'

interface MetaTagsProps {
    title?: string
    description?: string
    image?: string
    url?: string
}

export const useMetaTags = ({ title, description, image, url }: MetaTagsProps) => {
    useEffect(() => {
        if (title) {
            document.title = title
            updateMetaTag('property', 'og:title', title)
            updateMetaTag('property', 'twitter:title', title)
        }

        if (description) {
            updateMetaTag('name', 'description', description)
            updateMetaTag('property', 'og:description', description)
            updateMetaTag('property', 'twitter:description', description)
        }

        if (image) {
            updateMetaTag('property', 'og:image', image)
            updateMetaTag('property', 'twitter:image', image)
        }

        if (url) {
            updateMetaTag('property', 'og:url', url)
            updateMetaTag('property', 'twitter:url', url)
        }
    }, [title, description, image, url])
}

const updateMetaTag = (attr: string, key: string, content: string) => {
    let element = document.querySelector(`meta[${attr}="${key}"]`)
    
    if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, key)
        document.head.appendChild(element)
    }
    
    element.setAttribute('content', content)
}
