import { NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { searchMenu } from '@/lib/menu'
import { cn } from '@yukikaze/ui'
import { Typography } from '@yukikaze/ui/typography'

const SearchPage = () => {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    return (
        <>
            <div className='h-12 mb-6 text-sm border-b border-gray-400 mt-12'>
                <div className='flex items-center h-full'>
                    {searchMenu.map(menu => (
                        <NavLink
                            key={menu.path} to={{ pathname: menu.path, search: `q=${q}` }}
                            className={({ isActive }) => cn(
                                'px-4 hover:text-main-500 font-semibold cursor-pointer h-full relative content-center',
                                isActive && 'text-main-500 after:absolute after:top-full after:left-0 after:w-full after:h-0.5 bg-main-400 after:bg-primary'
                            )}
                        >
                            <Typography className='text-gray-600 font-bold m-0' variant={'caption'}>
                                {menu.text}
                            </Typography>
                        </NavLink>
                    ))}
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default SearchPage