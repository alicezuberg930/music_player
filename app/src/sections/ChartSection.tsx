import "chart.js/auto";
import { memo, useEffect, useRef, useState } from "react"
import SongItem from "@/sections/SongItem"
import { deepObjectComparison } from "@/lib/utils";
import { Link } from "react-router-dom";
import { paths } from '@/lib/route/paths';
import { Line } from "react-chartjs-2";
import type { ChartOptions, TooltipModel } from "chart.js/auto";
import type { Song } from "@/@types/song";
import { PlayCircle } from "lucide-react";

const ChartSection = () => {
    const [data, setData] = useState<any>(null)
    const { chart, ranks }: any = {}
    const [tooltipData, setTooltipData] = useState({ opacity: 0, top: 0, left: 0 })
    const [selectedSong, setSelectedSong] = useState<Song | null>(null)
    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: { display: false },
                grid: { color: 'rgba(255,255,255,0.3)', drawTicks: false },
                min: chart?.minScore,
                max: chart?.maxScore,
                border: { dash: [3, 4] }
            },
            x: {
                ticks: { color: 'rgba(255,255,255,0.5)' },
                grid: { color: 'transparent' }
            }
        },
        plugins: {
            tooltip: {
                enabled: false,
                external: ({ tooltip }) => {
                    if (!chartRef || !chartRef.current) return
                    if (tooltip.opacity === 0) {
                        if (tooltipData.opacity !== 0) setTooltipData(prev => ({ ...prev, opacity: 0 }));
                        return;
                    }
                    const newTooltipData = {
                        opacity: 1,
                        left: tooltip.caretX,
                        top: tooltip.caretY,
                    };
                    if (!deepObjectComparison(tooltipData, newTooltipData)) setTooltipData(newTooltipData)
                    onSelectTooltip(tooltip)
                }
            }
        },
        hover: { mode: 'dataset', intersect: false }
    }
    const chartRef = useRef(null)

    const onSelectTooltip = (tooltip: TooltipModel<"line">
    ) => {
        const counters = []
        for (let i = 0; i < 3; i++) {
            counters.push({
                data: chart?.items[Object.keys(chart?.items)[i]]?.filter((item: any) => +item.hour % 2 === 0)?.map((item: any) => item.counter),
                encodeId: Object.keys(chart?.items)[i],
            })
        }
        const line = +tooltip.body[0]?.lines[0]?.split(':')[1].replace(',', '')
        const rs = counters.find(item => item.data.some((n: any) => n === line))
        setSelectedSong(ranks?.find((item: any) => item.encodeId === rs?.encodeId))
    }

    useEffect(() => {
        const labels = chart?.times?.filter((item: any) => +item.hour % 2 === 0)?.map((item: any) => `${item.hour}:00`)
        const datasets = []
        if (chart?.items) {
            for (let i = 0; i < 3; i++) {
                datasets.push({
                    label: Object.keys(chart?.items)[i],
                    data: chart?.items[Object.keys(chart?.items)[i]]?.filter((item: any) => +item.hour % 2 === 0)?.map((item: any) => item.counter),
                    borderColor: i === 0 ? 'blue' : i === 1 ? 'yellow' : 'red',
                    tension: 0.4,
                    borderWidth: 2,
                    pointHoverRadius: 5,
                    pointBackgroundColor: 'white',
                    pointHitRadius: 5,
                    pointBorderColor: i === 0 ? '#4a90e2' : i === 1 ? '#b2bc53' : '#e35050',
                    animation: false,
                    pointHoverBorderWidth: 3,
                })
            }
            setData({ labels, datasets })
        }
    }, [chart])

    return (
        <div className="mt-12 relative w-full lg:h-[420px] h-[760px]">
            <div className="z-10 absolute top-0 bottom-0 left-0 right-0 bg-linear-to-t from-[#33104cf2] to-[#33104cf2] rounded-lg"></div>
            <div className="z-20 absolute top-0 bottom-0 left-0 right-0 p-5 flex flex-col gap-4">
                <Link to={paths.ZING_CHART} className="flex gap-2 items-center">
                    <h3 className="text-2xl text-white font-bold zing-chart-section">#zingchart</h3>
                    <span className="text-green-400 bg-white rounded-full p-1">
                        <PlayCircle size={20} />
                    </span>
                </Link>
                <div className="flex lg:flex-row flex-col gap-4 h-full">
                    <div className="flex-3 flex flex-col gap-3">
                        {
                            ranks && ranks?.slice(0, 3).map((song: any, index: number) => {
                                return (
                                    <SongItem song={song} imgSize="lg" percent={Math.round(song?.score / chart?.totalScore * 100)}
                                        order={index + 1} key={song?.encodeId} style="text-white hover:bg-[#A874B8] bg-[#ffffff12]"
                                    />
                                )
                            })
                        }
                        <Link to='' className="w-fit mx-auto bg-transparent text-white border border-white rounded-2xl py-1 px-5 text-sm">
                            Xem thêm
                        </Link>
                    </div>
                    <div className="flex-7 h-full relative">
                        {data && <Line data={data} ref={chartRef} options={options} />}
                        {selectedSong && <div className='tooltip absolute bg-main-200 rounded-md w-48 z-100' style={{ top: tooltipData.top, left: tooltipData.left, opacity: tooltipData.opacity }}>
                            <SongItem song={selectedSong} percent={Math.round(selectedSong.likes / chart?.totalScore * 100)} imgSize="sm" />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ChartSection)