import React, { memo, useCallback, useMemo, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@yukikaze/ui/drawer'
import { toast } from '@yukikaze/ui'
import { Button } from '@yukikaze/ui/button'
import { MessageSquareText } from '@yukikaze/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@yukikaze/ui/avatar'
import { Spinner } from '@yukikaze/ui/spinner'
import { Typography } from '@yukikaze/ui/typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fToNow } from '@/lib/format-time'
import { useAuthContext } from '@/providers/auth-provider'
import { useSelector } from '@/redux/store'
import { commentQueries } from '@/lib/queries/comment'
import type { Comment } from '@/@types'
import { FormProvider, RHFTextArea } from '@/components/hook-form'
import { createCommentInput, type CreateCommentInput } from '@yukikaze/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocales } from '@/lib/locales'

const CommentComposer: React.FC<{
    onSubmit: (data: CreateCommentInput) => Promise<void>
    songId?: string
}> = ({ onSubmit, songId }) => {
    const { translate } = useLocales()
    const methods = useForm<CreateCommentInput>({
        resolver: zodResolver(createCommentInput),
        defaultValues: { content: '', songId },
    })

    const {
        handleSubmit,
        formState: { isSubmitting }
    } = methods

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2 w-full'>
                <RHFTextArea
                    name='content'
                    placeholder={translate('comment_textarea_placeholder')}
                    className='resize-none'
                    disabled={isSubmitting}
                />
                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        size='sm'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? translate('comment_sending') : translate('comment_send')}
                    </Button>
                </div>
            </div>
        </FormProvider>
    )
}

const CommentItem: React.FC<{
    comment: Comment
    onReply: (commentId: string, content: string) => Promise<void>
    activeReplyId: string | null
    setActiveReplyId: React.Dispatch<React.SetStateAction<string | null>>
    songId?: string
}> = ({
    comment,
    onReply,
    activeReplyId,
    setActiveReplyId,
    songId
}) => {
        const { translate } = useLocales()
        const isReplyOpen = activeReplyId === comment.id
        const userName = comment.user?.fullname || translate('comment_default_user_name')
        const avatarFallback = useMemo(() => userName.charAt(0).toUpperCase(), [userName])

        const handleToggleReply = useCallback(() => {
            setActiveReplyId((current) => (current === comment.id ? null : comment.id))
        }, [comment.id, setActiveReplyId])

        const handleReplySubmit = useCallback(async (data: CreateCommentInput) => {
            await onReply(comment.id, data.content)
        }, [comment.id, onReply])

        return (
            <div className='flex flex-col gap-2'>
                <div className='flex gap-3'>
                    <Avatar className='size-9 shrink-0'>
                        {comment.user?.avatar && <AvatarImage src={comment.user?.avatar} alt={userName} />}
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                            <Typography className='font-semibold text-sm leading-none'>
                                {userName}
                            </Typography>
                            <Typography className='text-xs text-muted-foreground'>
                                {fToNow(comment.createdAt)}
                            </Typography>
                        </div>
                        <Typography className='mt-1 whitespace-pre-line'>
                            {comment.content}
                        </Typography>
                        <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
                            <span>{comment.likes ?? 0} {translate('comment_like_label')}</span>
                            <button
                                type='button'
                                className='hover:text-foreground'
                                onClick={handleToggleReply}
                            >
                                {translate('comment_reply')}
                            </button>
                        </div>
                        {isReplyOpen && (
                            <div className='mt-3'>
                                <CommentComposer
                                    onSubmit={handleReplySubmit}
                                    songId={songId}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {comment.replies?.length > 0 && (
                    <div className='ml-8 mt-2 border-l border-border/80 pl-4'>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                activeReplyId={activeReplyId}
                                setActiveReplyId={setActiveReplyId}
                                songId={songId}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

const CommentDrawer: React.FC = () => {
    const { currentSong } = useSelector((state) => state.music)
    const { isAuthenticated } = useAuthContext()
    const { translate } = useLocales()
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
    const { mutateAsync } = useMutation(commentQueries().create.mutationOptions())
    const { data, isLoading, isError } = useQuery(
        commentQueries().all.queryOptions(currentSong?.id ?? '', {
            page: 1,
            limit: 30,
        })
    )

    const comments = useMemo(() => data ?? [], [data])

    const clearReplyState = useCallback((commentId: string) => {
        setActiveReplyId((current) => (current === commentId ? null : current))
    }, [])

    const handleSubmitComment = useCallback(async (data: CreateCommentInput) => {
        const content = data.content.trim()
        if (!currentSong?.id || !content) return
        if (!isAuthenticated) {
            toast.error(translate('comment_login_to_comment'))
            return
        }

        await mutateAsync({
            songId: currentSong.id,
            content,
        }, {
            onSuccess: () => {
                toast.success(translate('comment_submit_success'))
            }
        })
    }, [currentSong?.id, isAuthenticated, mutateAsync, translate])

    const handleSubmitReply = useCallback(
        async (commentId: string, rawContent: string) => {
            const content = rawContent.trim()
            if (!currentSong?.id || !content) return
            if (!isAuthenticated) {
                toast.error(translate('comment_login_to_reply'))
                return
            }

            await mutateAsync({
                songId: currentSong.id,
                content,
                parentCommentId: commentId,
            }, {
                onSuccess: () => {
                    clearReplyState(commentId)
                    toast.success(translate('comment_reply_success'))
                },
            })
        },
        [currentSong?.id, isAuthenticated, mutateAsync, clearReplyState, translate]
    )

    return (
        <Drawer>
            <DrawerTrigger
                render={
                    <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label={translate('comment_toggle_button')}
                    />
                }
            >
                <MessageSquareText />
            </DrawerTrigger>
            <DrawerContent className='bg-white/70 backdrop-blur-lg overflow-hidden'>
                <div className='mx-auto w-full h-screen max-w-6xl relative'>
                    <DrawerHeader>
                        <DrawerTitle>{translate('comment_title')}</DrawerTitle>
                        <DrawerDescription>
                            {currentSong?.title ? `${currentSong.title} - ${currentSong.artistNames}` : ''}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className='px-4 pb-4 h-[calc(100%-10rem)] overflow-auto space-y-4'>
                        {!currentSong?.id ? (
                            <div className='rounded-md border border-dashed border-muted p-3 text-sm text-muted-foreground'>
                                {translate('comment_no_song_selected')}
                            </div>
                        ) : isAuthenticated ? (
                            <CommentComposer
                                onSubmit={handleSubmitComment}
                                songId={currentSong?.id}
                            />
                        ) : (
                            <div className='rounded-md border border-dashed border-muted p-3 text-sm text-muted-foreground'>
                                {translate('comment_need_login')}
                            </div>
                        )}

                        {!currentSong?.id ? (
                            <div className='rounded-md border border-dashed border-muted p-4 text-center text-sm text-muted-foreground'>
                                {translate('comment_waiting_for_song')}
                            </div>
                        ) : isLoading ? (
                            <div className='flex justify-center py-10'>
                                <Spinner className='size-6' />
                            </div>
                        ) : isError ? (
                            <Typography className='text-center text-sm text-destructive'>
                                {translate('comment_fetch_failed')}
                            </Typography>
                        ) : comments.length > 0 ? (
                            <div className='space-y-5 pr-3'>
                                {comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onReply={handleSubmitReply}
                                        activeReplyId={activeReplyId}
                                        setActiveReplyId={setActiveReplyId}
                                        songId={currentSong?.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-md border border-dashed border-muted p-4 text-center text-sm text-muted-foreground'>
                                {translate('comment_empty_state')}
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default memo(CommentDrawer)