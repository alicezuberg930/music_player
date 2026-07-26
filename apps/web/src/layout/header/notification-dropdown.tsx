import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@yukikaze/ui/dropdown-menu'
import { Bell, Check, cn } from '@yukikaze/ui'
import { Badge } from '@yukikaze/ui/badge'
import { memo, useEffect, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { notificationQueries } from '@/lib/queries/notification'
import { useInView } from '@/hooks/use-in-view'
import { Button } from '@yukikaze/ui/button'
import { ScrollArea } from '@yukikaze/ui/scroll-area'
import type { Notification } from '@/@types'
import { fDate } from '@/lib/format-time'
import { Typography } from '@yukikaze/ui/typography'

const NotificationDropdown: React.FC = () => {
    const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery(notificationQueries().all.queryOptions({ page: 1, limit: 5 }))
    const sentinelRef = useRef<HTMLDivElement>(null)
    const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(null)
    const isInView = useInView(sentinelRef, { once: false, margin: '20px', root: viewportElement })

    console.log("notification status: " + status)

    useEffect(() => {
        if (isInView && hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                nativeButton={false}
                render={
                    <div className='relative'>
                        <Bell className='text-white' />
                        {true && (
                            <Badge
                                variant='destructive'
                                className='absolute -top-2 -right-2 flex items-center justify-center h-5 w-5'
                            >
                                {12}
                            </Badge>
                        )}
                    </div>
                }
            />
            <DropdownMenuContent className='z-100 w-90' align='end'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='flex items-center justify-between px-4 py-3 border-b'>
                        <span className='font-semibold'>Notifications</span>
                        {true && (
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    // onMarkAllAsRead?.()
                                }}
                            >
                                <Check className='mr-1 h-3 w-3' />
                                Mark all as read
                            </Button>
                        )}
                    </DropdownMenuLabel>
                    <ScrollArea className='h-60' viewportRef={setViewportElement}>
                        {data?.pages.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
                                <Bell className='h-8 w-8 mb-2 opacity-40' />
                                <p className='text-sm'>No notifications</p>
                            </div>
                        ) : (
                            data?.pages.map((page) => (
                                page.data && <NotificationList key={page.timestamp} data={page.data} />
                            ))
                        )}
                        <div ref={sentinelRef}>
                            {isFetchingNextPage && (
                                <>loading</>
                            )}
                            {!hasNextPage && data?.pages[0]?.data && (
                                <Typography className='text-muted-foreground m-0 py-3' variant='caption'>No notification left</Typography>
                            )}
                        </div>
                    </ScrollArea>
                    {true && (
                        <>
                            <DropdownMenuSeparator />
                            <Button variant='ghost' size='sm' className='w-full text-muted-foreground'>
                                View all notifications
                            </Button>
                        </>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// const getNotificationIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//         case 'warning':
//         case 'alert':
//             return <AlertTriangle className='h-4 w-4 text-amber-500' />
//         case 'success':
//             return <CheckCircle className='h-4 w-4 text-emerald-500' />
//         case 'error':
//             return <AlertTriangle className='h-4 w-4 text-red-500' />
//         case 'message':
//             return <MessageSquare className='h-4 w-4 text-blue-500' />
//         case 'info':
//         default:
//             return <Info className='h-4 w-4 text-sky-500' />
//     }
// }

const NotificationList: React.FC<{ data: Notification[] }> = ({ data }) => {
    return (
        <>
            {
                data.map((notification, i) => (
                    <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                            'flex gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0 focus:bg-accent',
                            !notification.isRead && 'bg-accent/50 hover:bg-accent'
                        )}
                        onClick={() => {
                            if (!notification.isRead) {
                                // onMarkAsRead?.(notification.id)
                            }
                        }}
                    >
                        {/* Type Icon */}
                        {/* <div className='mt-0.5 shrink-0'> */}
                        {/* {getNotificationIcon(notification.type)} */}
                        {/* </div> */}

                        {/* Content */}
                        <div className='flex-1 min-w- 0'>
                            <div className='flex items-start justify-between gap-2'>
                                <Typography
                                    className={cn(
                                        'font-medium leading-none line-clamp-1',
                                        !notification.isRead && 'text-foreground'
                                    )}
                                    variant='p'
                                >
                                    {notification.title} {i}
                                </Typography>
                                {!notification.isRead && (
                                    <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary' />
                                )}
                            </div>
                            <Typography variant='p' className='text-muted-foreground line-clamp-2'>
                                {notification.content}
                            </Typography>
                            <p className='text-[11px] text-muted-foreground/70'>
                                {fDate(notification.time, 'DD/MM/YYYY')}
                            </p>
                        </div>
                    </DropdownMenuItem>
                ))
            }
        </>
    )
}

export default memo(NotificationDropdown)