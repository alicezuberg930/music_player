import { paths } from "./route/paths"
import { ChartPie, Newspaper, Telescope, User } from "@yukikaze/ui/icons"

export const sidebarMenu = [
    {
        path: paths.MY_MUSIC,
        text: 'personal',
        icon: <User />
    },
    {
        path: paths.HOME,
        text: 'discover',
        icon: <Telescope />
    },
    {
        path: paths.ZING_CHART,
        text: 'tien_chart',
        icon: <ChartPie />
    },
    {
        path: paths.FOLLOW,
        text: 'following',
        icon: <Newspaper />
    }
]

export const searchMenu = [
    {
        path: paths.SEARCH_ALL,
        text: 'Tất cả',
    },
    {
        path: paths.SEARCH_SONG,
        text: 'Bài hát',
    },
    {
        path: paths.SEARCH_PLAYLIST,
        text: 'Playlist/album',
    },
    {
        path: paths.SEARCH_ARTIST,
        text: 'Nghệ sĩ',
    },
    {
        path: paths.SEARCH_MV,
        text: 'MV',
    }
]