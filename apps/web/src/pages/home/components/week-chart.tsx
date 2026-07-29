import { memo, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import SongItem from '@/layout/song-item'
import { Link } from '@tanstack/react-router'
import { paths } from '@/lib/paths'
import type { Song } from '@/@types/song'
import { useQuery } from '@tanstack/react-query'
import { homeQueries, type WeekChartItem } from '@/lib/queries/home'

const DEFAULT_LINES = [
    { dataKey: 'song0', stroke: '#4a90e2' },
    { dataKey: 'song1', stroke: '#b2bc53' },
    { dataKey: 'song2', stroke: '#e35050' },
]

interface LegendFormatterProps {
    value: string
    songNames: Record<string, string>
    defaultName: string
}

const LegendFormatter = ({ value, songNames, defaultName }: LegendFormatterProps) => {
    const index = Number(value.replace('song', ''))
    const songId = Object.keys(songNames)[index]
    const songName = songId ? songNames[songId] : ''
    return <span style={{ color: 'white' }}>{songName || defaultName}</span>
}

const safeNumber = (value: string | number | null | undefined): number => {
    if (value === undefined || value === null) return 0
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const toDayLabel = (dateInput: string | number | Date): string => {
    const date = typeof dateInput === 'string'
        ? new Date(`${dateInput}T00:00:00`)
        : new Date(dateInput)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const createSongFromRanking = (item: WeekChartItem, listens = 0): Song => ({
    id: item.song.id,
    title: item.song.title,
    alias: item.song.title,
    artistNames: item.song.artistNames,
    duration: 0,
    isWorldWide: false,
    thumbnail: item.song.cover,
    lyricsFile: null,
    isPrivate: false,
    releaseDate: null,
    distributor: null,
    stream: '',
    isIndie: false,
    mvlink: null,
    hasLyrics: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: '',
    likes: 0,
    listens,
    liked: false,
    comments: 0,
    size: 0,
})

const resolveRankingItems = (payload: unknown): WeekChartItem[] => {
    if (Array.isArray(payload)) return payload as WeekChartItem[]
    if (!payload || typeof payload !== 'object') return []

    const nested = (payload as { data?: unknown }).data
    if (Array.isArray(nested)) return nested as WeekChartItem[]
    return []
}

const WeekChart = () => {
    const { data: rankingResponse } = useQuery(homeQueries().rankings.queryOptions())
    const [selectedSong, setSelectedSong] = useState<Song | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const rankingRows = useMemo(
        () => resolveRankingItems(rankingResponse).slice(0, 3),
        [rankingResponse]
    )

    const dayLabels = useMemo(() => {
        if (rankingRows.length === 0) return [] as string[]
        const dates = new Set<string>()
        rankingRows.forEach((item) => {
            item.views.forEach((view) => {
                dates.add(String(view.date))
            })
        })
        return [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    }, [rankingRows])

    const totalsBySongId = useMemo(() => {
        const map = new Map<string, number>()
        rankingRows.forEach((item) => {
            const total = item.views.reduce((acc, view) => acc + safeNumber(view.listens), 0)
            map.set(item.song.id, total)
        })
        return map
    }, [rankingRows])

    const totalTopListens = useMemo(
        () => [...totalsBySongId.values()].reduce((acc, listens) => acc + listens, 0),
        [totalsBySongId]
    )

    const chartData = useMemo(() => {
        if (rankingRows.length === 0 || dayLabels.length === 0) {
            return [] as Array<Record<string, string | number>>
        }

        return dayLabels.map((date) => {
            const point: Record<string, string | number> = { day: toDayLabel(date) }
            rankingRows.forEach((item, index) => {
                const target = item.views.find((view) => String(view.date) === date)
                point[`song${index}`] = safeNumber(target?.listens)
            })
            return point
        })
    }, [rankingRows, dayLabels])

    const maxScore = useMemo(() => {
        let max = 0
        chartData.forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (!key.startsWith('song')) return
                const value = safeNumber(item[key] as string | number)
                if (value > max) max = value
            })
        })
        return max === 0 ? 10 : max
    }, [chartData])

    const lines = useMemo(() =>
        rankingRows.map((_, index) => ({
            dataKey: `song${index}`,
            stroke: DEFAULT_LINES[index]?.stroke ?? '#fff',
        })),
        [rankingRows]
    )

    const topSongs = useMemo(() => {
        return rankingRows.map((item) =>
            createSongFromRanking(item, totalsBySongId.get(item.song.id) ?? 0)
        )
    }, [rankingRows, totalsBySongId])

    const topSongNames = useMemo(() => {
        const values: Record<string, string> = {}
        topSongs.forEach((song, index) => {
            values[`song${index}`] = song.title || song.id
        })
        return values
    }, [topSongs])

    const renderTooltip = () => {
        if (!selectedSong) return null
        const percent = totalTopListens > 0
            ? Math.round((safeNumber(selectedSong.listens) / totalTopListens) * 100)
            : 0

        return (
            <div
                className='absolute bg-main-200 rounded-md w-56 pointer-events-none z-50'
                style={{
                    left: tooltipPosition.x,
                    top: tooltipPosition.y,
                }}
            >
                <SongItem
                    song={selectedSong}
                    percent={percent}
                    imgSize='sm'
                    wrapperClassName='bg-primary text-white'
                />
            </div>
        )
    }

    const handleMouseOver = (songIndex: number, position: { x: number; y: number }) => {
        const song = topSongs[songIndex]
        if (song) {
            setSelectedSong(song)
            setTooltipPosition(position)
        }
    }

    const handleMouseLeave = () => {
        setSelectedSong(null)
    }

    return (
        <div className='mt-12 relative h-175 md:h-150'>
            <div className='absolute top-0 bottom-0 w-full bg-linear-to-t from-primary/40 to-primary rounded-lg'></div>
            <div className='absolute top-0 bottom-0 w-full flex flex-col gap-4 p-2 lg:p-4'>
                <Link to={paths.ZING_CHART} className='flex gap-2 items-center'>
                    <h3 className='text-2xl text-white font-bold zing-chart-section'>#yukikazechart</h3>
                </Link>
                <div className='flex lg:flex-row flex-col gap-4 h-full'>
                    <div className='flex-3 flex flex-col gap-3'>
                        {topSongs.map((song, index) => (
                            <SongItem
                                wrapperClassName='bg-primary/70 text-white'
                                song={song} imgSize='lg'
                                percent={Math.round(totalTopListens > 0 && totalsBySongId.get(song.id)
                                    ? (totalsBySongId.get(song.id)! / totalTopListens) * 100
                                    : 0)}
                                order={index + 1}
                                key={song?.id}
                            />
                        ))}
                        <Link
                            to='/chart'
                            className='w-fit mx-auto bg-transparent text-white border border-white rounded-2xl py-1 px-5 text-sm'
                        >
                            Xem them
                        </Link>
                    </div>
                    <div className='flex-7 relative w-full h-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart
                                data={chartData}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CartesianGrid
                                    strokeDasharray='3 4'
                                    stroke='rgba(255,255,255,0.3)'
                                />
                                <XAxis
                                    dataKey='day'
                                    stroke='rgba(255,255,255,0.5)'
                                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <YAxis
                                    domain={[0, maxScore]}
                                    stroke='rgba(255,255,255,0.3)'
                                    tick={false}
                                    strokeDasharray='3 4'
                                />
                                <Legend
                                    verticalAlign='top'
                                    height={32}
                                    iconType='line'
                                    formatter={(value) => (
                                        <LegendFormatter
                                            value={value}
                                            songNames={topSongNames}
                                            defaultName={value}
                                        />
                                    )}
                                />
                                {lines.map((line, i) => {
                                    const key = line.dataKey
                                    return (
                                        <Line
                                            key={key}
                                            type='monotone'
                                            dataKey={key}
                                            name={key}
                                            stroke={line.stroke}
                                            strokeWidth={2}
                                            dot={{ fill: 'white', stroke: '#4a90e2', strokeWidth: 2, r: 3 }}
                                            isAnimationActive={false}
                                            activeDot={{
                                                r: 5,
                                                onMouseOver: (_event, payload) => {
                                                    const point = payload as { cx?: number; cy?: number }
                                                    if (!point || point.cx === undefined || point.cy === undefined) return
                                                    handleMouseOver(i, { x: point.cx, y: point.cy })
                                                },
                                                onMouseLeave: handleMouseLeave,
                                            }}
                                        />
                                    )
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                        {renderTooltip()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(WeekChart)
