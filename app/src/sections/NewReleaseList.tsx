import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import SongItem from "./SongItem"

const NewReleaseList = () => {
    const { newRelease } = useSelector(state => state.app)
    const [type, setType] = useState(-1)
    const [songs, setSongs] = useState<any>([])

    const setNewReleaseSongs = () => {
        if (type === -1) setSongs(newRelease?.items?.all || [])
        if (type === 0) setSongs(newRelease?.items?.others || [])
        if (type === 1) setSongs(newRelease?.items?.vPop || [])
    }

    useEffect(() => {
        setNewReleaseSongs()
    }, [type, newRelease])

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{newRelease?.title}</h3>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="flex items-center gap-5 text-xs">
                <button onClick={() => setType(-1)} className={`${type === -1 ? 'bg-main-500 text-white' : ''} py-1 px-4 rounded-l-full rounded-r-full border border-gray-400`}>
                    Tất cả
                </button>
                <button onClick={() => setType(0)} className={`${type === 0 ? 'bg-main-500 text-white' : ''} py-1 px-4 rounded-l-full rounded-r-full border border-gray-400`}>
                    Quốc tế
                </button>
                <button onClick={() => setType(1)} className={`${type === 1 ? 'bg-main-500 text-white' : ''} py-1 px-4 rounded-l-full rounded-r-full border border-gray-400`}>
                    Việt nam
                </button>
            </div>
            <div className="flex flex-wrap w-full mt-5">
                {songs?.slice(0, 12)?.map(item => (
                    <div key={item?.encodeId} className="md:w-[45%] xl:w-[30%]">
                        <SongItem song={item} imgSize="lg" showTime={true} />
                    </div>
                ))}
            </div>
        </div >
    )
}

export default NewReleaseList