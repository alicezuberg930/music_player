import { useEffect } from 'react'

type Props = {
    title: string
    description: string
    canonical: string
    image?: string
    schemaMarkup?: object
}

export const useSEO = ({ title, description, canonical, image, schemaMarkup }: Props) => {
    useEffect(() => {
        // Update title
        document.title = title

        // Update or create meta tags
        const updateMetaTag = (selector: string, attribute: string, content: string) => {
            let element = document.querySelector(selector)
            if (!element) {
                element = document.createElement('meta')
                if (attribute === 'name') {
                    element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''))
                } else {
                    element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''))
                }
                document.head.appendChild(element)
            }
            element.setAttribute('content', content)
        }

        // Update description
        updateMetaTag('meta[name="description"]', 'name', description)

        // Update Open Graph tags
        updateMetaTag('meta[property="og:title"]', 'property', title)
        updateMetaTag('meta[property="og:description"]', 'property', description)
        updateMetaTag('meta[property="og:url"]', 'property', canonical)
        if (image) {
            updateMetaTag('meta[property="og:image"]', 'property', image)
        }

        // Update Twitter Card tags
        updateMetaTag('meta[name="twitter:title"]', 'name', title)
        updateMetaTag('meta[name="twitter:description"]', 'name', description)
        if (image) {
            updateMetaTag('meta[name="twitter:image"]', 'name', image)
        }

        // Update canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
        if (!canonicalLink) {
            canonicalLink = document.createElement('link')
            canonicalLink.rel = 'canonical'
            document.head.appendChild(canonicalLink)
        }
        canonicalLink.href = canonical

        // Add schema markup if provided
        if (schemaMarkup) {
            let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement
            if (!script) {
                script = document.createElement('script')
                script.type = 'application/ld+json'
                document.head.appendChild(script)
            }
            script.textContent = JSON.stringify(schemaMarkup)
        }
    }, [title, description, canonical, image, schemaMarkup])
}