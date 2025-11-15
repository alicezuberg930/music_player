import { NavLink, useParams } from "react-router-dom"
import bgWeekChart from "../assets/bg-week-chart.jpg"
import { icons } from "@/lib/icons"
import { useSelector } from "react-redux"
import { useCallback, useEffect, useState } from "react"
import { getWeekChart } from "../services/api.service"
import { toast } from "react-toastify"
import RankListCard from "@/sections/RankListCard"

const WeeklyZingChartPage = () => {
    const { id } = useParams()
    const { BsPlayFill } = icons
    const normalStyle = "mr-4 py-3 font-semibold text-2xl cursor-pointer h-full relative flex items-center"
    const activeStyle = " search-tab-item after:w-full text-main-500"
    const { weekChartLinks } = useSelector(state => state.music)
    const [songs, setSongs] = useState(null)

    const fetchWeekChart = useCallback(async (week, year) => {
        try {
            const response = await getWeekChart(id);
            if (response?.err === 0) {
                setSongs(response?.data?.items)
            } else {
                toast.warn(response?.msg)
            }
        } catch (error) {
            toast.warn(error)
        }
    }, [id])

    useEffect(() => {
        fetchWeekChart()
    }, [id, fetchWeekChart])

    return (
        <div className="">
            <div className='relative h-[450px]'>
                <img src={bgWeekChart} alt="bg-chart" className='w-full h-full block object-cover grayscale' />
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-[rgba(206,217,217,0.7)]'></div>
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-[#CED9D9] to-transparent'></div>
                <div className="absolute top-[20%] left-0 right-0 bottom-0 px-10 flex flex-col gap-4">
                    <span className="flex gap-2 text-main-500 items-center mb-10">
                        <h3 className="text-4xl font-bold">Bảng xếp hạng tuần</h3>
                        <span className="bg-white rounded-full p-1">
                            <BsPlayFill color="green" size={20} />
                        </span>
                    </span>
                    <div className="flex gap-8">
                        {
                            weekChartLinks?.map(link => {
                                let temp = link.split('/')[2];
                                return (
                                    <NavLink to={link.split('.')[0]} key={link}
                                        className={({ isActive }) => isActive ? normalStyle + activeStyle : normalStyle}
                                    >
                                        {temp?.includes("Viet-Nam") ? 'Việt Nam' : temp?.includes("US-UK") ? 'US-UK' : 'K-Pop'}
                                    </NavLink>
                                )
                            })
                        }
                    </div>
                    <RankListCard songs={songs} initialAmount={Infinity} />
                </div>
            </div>
        </div>
    )
}

export default WeeklyZingChartPage