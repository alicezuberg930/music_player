import { queryOptions } from '@tanstack/react-query'
import type {
    Response,
    HomeData
} from '@/@types'
import { httpClient } from '../repository/http-client'

export const keys = {
    all: () => ['home', 'all']
} as const

export const homeQueries = () => ({
    all: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.all(),
                queryFn: async () => {
                    const { data } = await httpClient.get<
                        Response<HomeData>
                    >('/home/get')
                    return data
                },
            }),
    },
})