import "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import { icons } from "@/lib/icons"
import { deepObjectComparison } from "@/lib/utils"
import SongItem from "@/sections/SongItem"
import bgChart from '../assets/bg-zing-chart.png'
import { toast } from "react-toastify"
import { zingChartDataHC } from "@/assets/dummy_data"
import RankListCard from "@/sections/RankListCard"
import { useDispatch } from "react-redux"
import type { Song } from "@/@types/song"
import type { ChartOptions, TooltipModel } from "chart.js/auto"

const ZingChartPage = () => {
    const [chartData, setChartData] = useState<any>(null)
    const chartRef = useRef(null)
    const { BsPlayFill } = icons
    const [data, setData] = useState<any>(null)
    const [tooltipData, setTooltipData] = useState({ opacity: 0, top: 0, left: 0 })
    const [selectedSong, setSelectedSong] = useState<Song | null>(null)
    const dispatch = useDispatch()
    const options: ChartOptions<'line'> = {
        responsive: true,
        // pointRadius: 0,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: { display: false },
                grid: { color: 'rgba(0,0,0,0.4)', drawTicks: false },
                min: chartData?.RTChart?.chart?.minScore,
                max: chartData?.RTChart?.chart?.maxScore,
                border: { dash: [3, 4] }
            },
            x: {
                ticks: { color: 'rgba(0,0,0,0.4)' },
                grid: { color: 'transparent' }
            }
        },
        plugins: {
            // legend: false,
            tooltip: {
                enabled: false,
                external: ({ tooltip }: { tooltip: TooltipModel<'line'> }) => {
                    if (!chartRef || !chartRef.current) return
                    if (tooltip.opacity === 0) {
                        if (tooltipData.opacity !== 0) setTooltipData(prev => ({ ...prev, opacity: 0 }))
                        return
                    }
                    const newTooltipData = {
                        opacity: 1,
                        left: tooltip.caretX,
                        top: tooltip.caretY,
                    }
                    if (!deepObjectComparison(tooltipData, newTooltipData)) setTooltipData(newTooltipData)
                    onSelectTooltip(tooltip)
                }
            }
        },
        hover: { mode: 'dataset', intersect: false }
    }

    const onSelectTooltip = (tooltip: any) => {
        const counters = []
        for (let i = 0; i < 3; i++) {
            counters.push({
                data: chartData?.RTChart?.chart?.items[Object.keys(chartData?.RTChart?.chart?.items)[i]]?.filter((i: any) => +i.hour % 2 === 0)?.map((item: any) => item.counter),
                encodeId: Object.keys(chartData?.RTChart?.chart?.items)[i],
            })
        }
        const line = +tooltip.body[0]?.lines[0]?.split(':')[1].replace(',', '')
        const rs = counters.find(item => item.data.some((n: any) => n === line))
        setSelectedSong(chartData?.RTChart?.items?.find((item: any) => item.encodeId === rs!.encodeId))
    }

    const fetchChartHome = async () => {
        try {
            // const response = await getChartHome()
            // if (response.err === 0) {
            //     setChartData(response?.data)
            // } else {
            //     toast.warn(response.msg)
            // }
        } catch (error) {
            toast.warn(error as string)
        }
    }

    useEffect(() => {
        fetchChartHome()
        let links = []
        for (let i = 0; i < 3; i++) {
            let key = Object.keys(zingChartDataHC.weekChart)[i]
            links.push(zingChartDataHC.weekChart[key as keyof typeof zingChartDataHC.weekChart].link)
        }
        // dispatch(setWeekChartLink(links))
    }, [dispatch])

    useEffect(() => {
        const labels = chartData?.RTChart?.chart?.times?.filter((item: any) => +item.hour % 2 === 0)?.map((item: any) => `${item.hour}:00`)
        const datasets = []
        if (chartData?.RTChart?.chart?.items) {
            for (let i = 0; i < 3; i++) {
                datasets.push({
                    label: Object.keys(chartData?.RTChart?.chart?.items)[i],
                    data: chartData?.RTChart?.chart?.items[Object.keys(chartData?.RTChart?.chart?.items)[i]]?.filter((i: any) => +i.hour % 2 === 0)?.map((item: any) => item.counter),
                    borderColor: i === 0 ? 'blue' : i === 1 ? 'yellow' : 'red',
                    tension: 0.3,
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
    }, [chartData])

    return (
        <div className="w-full">
            <div className='relative h-[500px]'>
                <img src={bgChart} alt="bg-chart" className='w-full h-full block object-cover grayscale' />
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(206,217,217,0.9)]'></div>
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-linear-to-t from-[#CED9D9] to-transparent'></div>
                <div className="absolute top-[20%] left-0 right-0 bottom-0 px-10">
                    <span className="flex gap-2 items-center mb-10">
                        <h3 className="text-4xl text-white font-bold zing-chart-section">#zingchart</h3>
                        <span className="text-green-400 bg-white rounded-full p-1">
                            <BsPlayFill color="green" size={20} />
                        </span>
                    </span>
                    <div className="h-[300px] relative">
                        {data && <Line data={data} ref={chartRef} options={options} />}
                        <div className='tooltip absolute bg-main-200 rounded-md w-48 z-100'
                            style={{ top: tooltipData.top, left: tooltipData.left, opacity: tooltipData.opacity }}
                        >
                            <SongItem song={selectedSong} percent={Math.round(selectedSong?.likes! / chartData?.RTChart?.chart?.totalScore * 100)} imgSize="sm" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-10">
                <RankListCard initialAmount={10} songs={chartData?.RTChart?.items} />
            </div>
            <div className='relative'>
                <img src={bgChart} alt="bg-chart" className='w-full h-full block object-cover grayscale' />
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(206,217,217,0.9)]'></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 px-10 flex flex-col gap-8">
                    <h3 className="text-4xl text-main-500 font-bold mt-8">Bảng xếp hạng tuần</h3>
                    <div className="flex gap-4 w-full">
                        {
                            chartData?.weekChart && Object.entries(chartData?.weekChart)?.map((item: any) => {
                                return (
                                    <div key={item[0]} className="flex-1 bg-[rgba(255,255,255,0.5)] rounded-2xl px-2 py-5" >
                                        <h3 className="font-bold text-2xl text-main-500">{item[0] === "vn" ? "Việt Nam" : item[0] === "us" ? 'US-UK' : 'K-Pop'}</h3>
                                        <RankListCard initialAmount={5} songs={item[1].items} hideAlbum={true} link={item[1]?.link} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ZingChartPage