import SongList from '../sections/SongList'
import { useSearchParams } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { SongListShimmer } from '@/components/loading-placeholder'
import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'

const SearchSongPage = () => {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: false, margin: '10px' })
    const { data: songData, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useApi().useSongList({ search: q ?? '', limit: 15 })
    const { translate } = useLocales()

    useEffect(() => {
        if (isInView) fetchNextPage()
    }, [isInView, fetchNextPage])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('song')}</Typography>
            {status === 'pending' && (<SongListShimmer />)}
            {status === 'error' && (<div>Error loading songs</div>)}
            {status === 'success' && (
                songData.pages.map(page => (
                    page?.data && <SongList showHeader={false} songs={page.data} key={page.timestamp} />
                ))
            )}
            <div ref={ref}>
                {isFetchingNextPage && (
                    <SongListShimmer showHeader={false} />
                )}
                {!hasNextPage && songData?.pages[0]?.data && (
                    <p className="text-center text-muted-foreground py-4"></p>
                )}
            </div>
        </div>
    )
}

export default SearchSongPage