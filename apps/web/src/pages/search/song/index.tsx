import SongList from '@/layout/song-list'
import { useLocation } from '@tanstack/react-router'
import { SongListShimmer } from '@/components/loading-placeholder'
import { useEffect, useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'
import { useInfiniteQuery } from '@tanstack/react-query'
import { songQueries } from '@/lib/queries/song'

const SearchSongPage = () => {
    const location = useLocation()
    const q = new URLSearchParams(location.search).get('q')
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: false, margin: '10px' })
    const {
        data,
        status,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage
    } = useInfiniteQuery(songQueries().all.queryOptions({ search: q ?? '', limit: 15 }))
    const { translate } = useLocales()

    useEffect(() => {
        if (isInView && hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('song')}</Typography>
            {status === 'pending' && (<SongListShimmer />)}
            {status === 'error' && (<div>Error loading songs</div>)}
            {status === 'success' && (
                data?.pages.map(page => (
                    page?.data && <SongList showHeader={false} songs={page.data} key={page.timestamp} />
                ))
            )}
            <div ref={ref}>
                {isFetchingNextPage && (
                    <SongListShimmer showHeader={false} />
                )}
                {!hasNextPage && data?.pages[0]?.data && (
                    <p className='text-center text-muted-foreground py-4'></p>
                )}
            </div>
        </div>
    )
}

export default SearchSongPage
