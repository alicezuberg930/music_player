import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'

import SongItem from '@/sections/SongItem'
import { Link } from 'react-router-dom'
import { paths } from '@/lib/route/paths'
import type { Song } from '@/@types/song'
import { a } from './chartData'

const lines = [
    { dataKey: 'song0', stroke: '#4a90e2' },
    { dataKey: 'song1', stroke: '#b2bc53' },
    { dataKey: 'song2', stroke: '#e35050' },
]

interface LegendFormatterProps {
    value: string
    chartItems: Record<string, any>
    promotes: Song[]
}

const LegendFormatter: React.FC<LegendFormatterProps> = ({ value, chartItems, promotes }) => {
    const songIndex = value.replace('song', '')
    const songId = Object.keys(chartItems)[+songIndex]
    const song = promotes.find(s => s.id === songId)
    return <span style={{ color: 'white' }}>{song?.title || value}</span>
}

const ChartSection2: React.FC = () => {
    const { chart, promotes } = a
    const [selectedSong, setSelectedSong] = useState<Song | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

    const chartData = chart?.times
        .filter(item => +item.hour % 2 === 0)
        .map(time => {
            const dataPoint: Record<string, string | number> = {
                time: `${time.hour}:00`,
            }
            Object.keys(chart.items).forEach((songId, index) => {
                const item = chart.items[songId as keyof typeof chart.items].find(item => item.hour === time.hour)
                if (item) {
                    dataPoint[`song${index}`] = item.counter
                    dataPoint[`songId${index}`] = songId
                }
            })

            return dataPoint
        })

    const renderTooltip = () => {
        if (!selectedSong) return null
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
                    percent={Math.round(selectedSong.likes / chart?.totalScore * 100)}
                    imgSize='sm'
                />
            </div>
        )
    }

    const handleMouseOver = (songIndex: number, position: { x: number; y: number }) => {
        const songId = Object.keys(chart.items)[songIndex]
        const song = promotes.find(s => s.id === songId)
        if (song) {
            setSelectedSong(song)
            setTooltipPosition(position)
        }
    }

    const handleMouseLeave = () => {
        setSelectedSong(null)
    }

    return (
        <div className='mt-12 relative h-[700px] md:h-[600px]'>
            <div className='absolute top-0 bottom-0 w-full bg-linear-to-t from-[#33104cf2] to-[#33104cf2] rounded-lg'></div>
            <div className='absolute top-0 bottom-0 w-full flex flex-col gap-4 p-2 lg:p-4'>
                <Link to={paths.ZING_CHART} className='flex gap-2 items-center'>
                    <h3 className='text-2xl text-white font-bold zing-chart-section'>#yukikazechart</h3>
                </Link>
                <div className='flex lg:flex-row flex-col gap-4 h-full'>
                    <div className='flex-3 flex flex-col gap-3'>
                        {promotes?.slice(0, 3).map((song, index) => (
                            <SongItem
                                song={song} imgSize='lg'
                                percent={Math.round(song?.score / chart?.totalScore * 100)}
                                order={index + 1} key={song?.id}
                                style='text-white hover:bg-[#A874B8] bg-[#ffffff12]'
                            />
                        ))}
                        <Link to='' className='w-fit mx-auto bg-transparent text-white border border-white rounded-2xl py-1 px-5 text-sm'>
                            Xem thêm
                        </Link>
                    </div>
                    <div className='flex-7 relative w-full h-full'>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                onMouseLeave={handleMouseLeave}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 4"
                                    stroke="rgba(255,255,255,0.3)"
                                />
                                <XAxis
                                    dataKey="time"
                                    stroke="rgba(255,255,255,0.5)"
                                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <YAxis
                                    domain={[chart.minScore, chart.maxScore]}
                                    stroke="rgba(255,255,255,0.3)"
                                    tick={false}
                                    strokeDasharray="3 4"
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={32}
                                    iconType="line"
                                    formatter={(value) => (
                                        <LegendFormatter
                                            value={value}
                                            chartItems={chart.items}
                                            promotes={promotes}
                                        />
                                    )}
                                />
                                {lines.map((line, i) => (
                                    <Line
                                        type="monotone"
                                        dataKey={line.dataKey}
                                        name={line.dataKey}
                                        key={line.dataKey}
                                        stroke={line.stroke}
                                        strokeWidth={2}
                                        dot={{ fill: 'white', stroke: '#4a90e2', strokeWidth: 2, r: 3 }}
                                        isAnimationActive={false}
                                        activeDot={{
                                            r: 5,
                                            onMouseOver: (_event: any, payload: any) => {
                                                handleMouseOver(i, { x: payload.cx, y: payload.cy })
                                            },
                                            onMouseLeave: handleMouseLeave,
                                        }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                        {renderTooltip()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartSection2