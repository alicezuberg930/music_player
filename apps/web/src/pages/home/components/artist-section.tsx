import type { Artist } from "@/@types/artist"
import ArtistCard from "@/layout/artist-card"
import { useMobile } from "@/hooks/use-mobile"
import { Typography } from "@yukikaze/ui/typography"
import { useLocales } from "@/lib/locales"
import { memo } from "react"

type Props = {
    artists: Artist[]
}

const ArtistSection: React.FC<Props> = ({ artists }) => {
    const isMobile = useMobile()
    const { translate } = useLocales()

    return (
        <section className="mt-12">
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <Typography variant={'h5'}>{translate('spotlight_artist')}</Typography>
                    <span className="text-xs uppercase">{translate('all')}</span>
                </div>
            </div>
            <div className="flex items-center mt-12 gap-4">
                {artists.slice(0, isMobile ? 2 : 5)?.map(artist => (
                    <ArtistCard artist={artist} key={artist?.id} visibleSlides={isMobile ? 2 : 5} />
                ))}
            </div>
        </section>
    )
}

export default memo(ArtistSection)