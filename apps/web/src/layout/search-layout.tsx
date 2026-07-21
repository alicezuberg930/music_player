import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { searchMenu } from '@/lib/menu-items'
import { cn } from '@yukikaze/ui'
import { Typography } from '@yukikaze/ui/typography'

export const SearchLayout = () => {
    const location = useLocation()
    const q = new URLSearchParams(location.search).get('q')
    const searchPath = q ? `?q=${encodeURIComponent(q)}` : ''

    return (
        <>
            <div className='h-12 mb-6 text-sm border-b border-gray-400 mt-12'>
                <div className='flex items-center h-full'>
                    {searchMenu.map(menu => (
                        <Link
                            key={menu.path} to={`/search/${menu.path}${searchPath}`}
                            className={cn(
                                'px-4 hover:text-main-500 font-semibold cursor-pointer h-full relative content-center',
                                location.pathname === `/search/${menu.path}` && 'text-main-500 after:absolute after:top-full after:left-0 after:w-full after:h-0.5 bg-main-400 after:bg-primary'
                            )}
                        >
                            <Typography className='text-gray-600 font-bold m-0' variant={'caption'}>
                                {menu.text}
                            </Typography>
                        </Link>
                    ))}
                </div>
            </div>
            <Outlet />
        </>
    )
}