import { useLocation } from '@tanstack/react-router'
import React, { useEffect, useRef } from 'react'
import VideoCard from '@/layout/video-card'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'
import { useInView } from '@/hooks/use-in-view'
import { useInfiniteQuery } from '@tanstack/react-query'
import { videoQueries } from '@/lib/queries/video'
import { SongListShimmer } from '@/components/loading-placeholder'
import type { Video } from '@/@types'

const SearchMVPage = () => {
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
    } = useInfiniteQuery(videoQueries().all.queryOptions({ search: q ?? '', limit: 15 }))
    const { translate } = useLocales()

    useEffect(() => {
        if (isInView && hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('MV')}</Typography>
            {status === 'pending' && (<SongListShimmer />)}
            {status === 'error' && (<div>Error loading songs</div>)}
            {status === 'success' && (
                data?.pages.map(page => (
                    <React.Fragment key={page.timestamp}>
                        {page?.data && (
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8'>
                                {page?.data?.map((video: Video) => (
                                    <VideoCard video={video} key={video?.id} />
                                ))}
                            </div>
                        )}
                    </React.Fragment>
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

export default SearchMVPage
