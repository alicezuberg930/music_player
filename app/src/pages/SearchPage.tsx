import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { searchMenu } from '@/lib/menu'

const SearchPage = () => {
    const normalStyle = 'px-4 hover:text-main-500 font-semibold cursor-pointer h-full relative flex items-center'
    const activeStyle = ' search-tab-item after:w-full'
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    // useEffect(() => {
    //     dispatch(getSearchSongs(searchData?.top?.id))
    // }, [q, searchData?.top?.id, dispatch])

    return (
        <>
            <div className='flex h-12 mb-6 items-center text-sm border-b border-gray-400'>
                <span className='text-2xl font-bold pr-4 border-r border-gray-400'>Kết quả tìm kiếm</span>
                <div className='flex items-center h-full'>
                    {searchMenu.map(menu => (
                        <NavLink
                            key={menu.path} to={{ pathname: menu.path, search: `q=${q}` }}
                            className={({ isActive }) => isActive ? normalStyle + activeStyle : normalStyle}
                        >
                            {menu.text}
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default SearchPage