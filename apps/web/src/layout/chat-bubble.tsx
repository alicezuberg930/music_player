import { MessageCircle } from '@yukikaze/ui'
import { Button } from '@yukikaze/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@yukikaze/ui/popover'
import {
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    useCallback,
    createContext,
    useContext,
} from 'react';
import { Send, ChevronDown, CheckCheck } from '@yukikaze/ui';
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from '@yukikaze/ui/message'
import { Bubble, BubbleContent, BubbleGroup } from '@yukikaze/ui/bubble'
import { Avatar, AvatarFallback, AvatarImage } from '@yukikaze/ui/avatar';
import { Input } from '@yukikaze/ui/input';

// Fake data — a two-person thread about weekend trail plans
const initialMessages = [
    { id: 1, sender: 'them', text: 'hey!! are we still on for the trail saturday?', time: '2:12 PM' },
    { id: 2, sender: 'them', text: 'just checked, weather looks clear all day', time: '2:12 PM' },
    { id: 3, sender: 'me', text: 'yesss, been looking forward to this all week', time: '2:14 PM' },
    { id: 4, sender: 'me', text: 'what time were you thinking?', time: '2:14 PM' },
    { id: 5, sender: 'them', text: 'maybe 8am? beats the heat and the crowds', time: '2:15 PM' },
    { id: 6, sender: 'them', text: 'lot fills up fast on weekends if we"re not early', time: '2:16 PM' },
    { id: 7, sender: 'me', text: '8 works. is it dog friendly? thinking of bringing Biscuit', time: '2:17 PM' },
    { id: 8, sender: 'me', text: 'he"s been dying to get out of the apartment lol', time: '2:17 PM' },
    { id: 9, sender: 'them', text: 'yes bring him!! just leash him for the first mile, it gets narrow near the creek', time: '2:18 PM' },
    { id: 10, sender: 'me', text: 'perfect, he"s gonna lose his mind', time: '2:19 PM' },
    { id: 11, sender: 'me', text: 'lunch after, or just snacks on the trail?', time: '2:19 PM' },
    { id: 12, sender: 'them', text: 'snacks on the trail, then that taco place after? the one with the good horchata', time: '2:20 PM' },
    { id: 13, sender: 'me', text: 'oh you remembered 😂 say less', time: '2:22 PM' },
    { id: 14, sender: 'them', text: 'of course lol. I"ll bring trail mix and extra water, can you grab sunscreen?', time: '2:23 PM' },
    { id: 15, sender: 'me', text: 'yep, got it covered', time: '2:24 PM' },
    { id: 16, sender: 'me', text: 'see you saturday!! 🥾', time: '2:24 PM' },
    { id: 17, sender: 'them', text: 'can"t wait!! 🐾', time: '2:25 PM' },
];

const replyPool = [
    'haha yesss',
    'wait totally agree',
    'no way, really?',
    'I"m so down for that',
    'same tbh 😂',
    'can"t wait for this',
    'omg say less',
];

const makeStartClock = () => {
    const d = new Date();
    d.setHours(14, 27, 0, 0);
    return d;
}

const reduceMotionPreferred = () => {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

// MessageScroller — local recreation of shadcn/ui's scroll-anchoring pattern.
// The real package just shipped, so this mirrors its provider/viewport/button
// composition and behavior by hand: open already at the live edge, follow
// new content while the reader is at the bottom, and stop following the
// instant they scroll away.
const ScrollerContext = createContext<any>(null);

const MessageScrollerProvider = ({ children }: { children: React.ReactNode }) => {
    const viewportRef = useRef<any>(null);
    const [autoFollow, setAutoFollow] = useState<any>(true);

    const handleScroll = useCallback((e: any) => {
        const el = e.currentTarget;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setAutoFollow(distanceFromBottom < 48);
    }, []);

    return (
        <ScrollerContext.Provider value={{ viewportRef, autoFollow, setAutoFollow, handleScroll }}>
            {children}
        </ScrollerContext.Provider>
    );
}

const useMessageScroller = () => {
    const ctx = useContext(ScrollerContext);
    if (!ctx) throw new Error('MessageScroller parts must be used inside a MessageScrollerProvider');
    return ctx;
}

const MessageScrollerViewport = ({ children, watch }: { children: React.ReactNode, watch: string }) => {
    const { viewportRef, autoFollow, handleScroll } = useMessageScroller();

    // Open already anchored at the live edge — no scroll animation on mount.
    useLayoutEffect(() => {
        const el = viewportRef.current;
        if (el) el.scrollTop = el.scrollHeight;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Follow the live edge as new content arrives, unless the reader scrolled away.
    useEffect(() => {
        if (!autoFollow) return;
        const el = viewportRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: reduceMotionPreferred() ? 'auto' : 'smooth' });
    }, [watch, autoFollow]);

    return (
        <div
            ref={viewportRef}
            onScroll={handleScroll}
            className='h-full overflow-y-auto px-4 py-4 flex flex-col gap-3'
        >
            {children}
        </div>
    );
}

const MessageScrollerButton = () => {
    const { autoFollow, setAutoFollow } = useMessageScroller();
    if (autoFollow) return null;
    return (
        <button
            type='button'
            onClick={() => setAutoFollow(true)}
            aria-label='Jump to latest messages'
            className='absolute bottom-3 right-3 h-9 w-9 rounded-full bg-stone-50 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 transition-colors'
        >
            <ChevronDown className='h-4 w-4 text-stone-600' />
        </button>
    );
}

// Chat panel — composes Message + MessageScroller, owns conversation state
const ChatPanel = () => {
    const { setAutoFollow } = useMessageScroller();
    const [messages, setMessages] = useState(initialMessages);
    const [draft, setDraft] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const clockRef = useRef(makeStartClock());
    const replyIndexRef = useRef(0);

    const nextTime = () => {
        clockRef.current = new Date(clockRef.current.getTime() + 60000 * (1 + Math.floor(Math.random() * 2)));
        return clockRef.current.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const send = () => {
        const text = draft.trim();
        if (!text) return;
        setAutoFollow(true);
        setMessages((m) => [...m, { id: Date.now(), sender: 'me', text, time: nextTime() }]);
        setDraft('');
        setIsTyping(true);
        const delay = 900 + Math.random() * 900;
        window.setTimeout(() => {
            setIsTyping(false);
            const reply = replyPool[replyIndexRef.current % replyPool.length];
            replyIndexRef.current += 1;
            setMessages((m) => [...m, { id: Date.now() + 1, sender: 'them', text: reply, time: nextTime() }]);
        }, delay);
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            send();
        }
    };

    const grouped: any = [];
    messages.forEach((msg) => {
        const last = grouped[grouped.length - 1];
        if (last && last.sender === msg.sender) last.items.push(msg);
        else grouped.push({ sender: msg.sender, items: [msg] });
    });

    return (
        <>
            <style>{`
        @media (prefers-reduced-motion: reduce) {
          .typing-dot { animation: none !important; }
        }
      `}</style>

            {/* Header */}
            <div className='flex items-center gap-3 border-b p-2'>
                <div className='relative'>
                    <div className='h-10 w-10 rounded-full bg-orange-800 text-white flex items-center justify-center text-sm font-semibold'>
                        M
                    </div>
                    <span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-stone-50' />
                </div>
                <div className='flex flex-col leading-tight'>
                    <span className='text-sm font-semibold tracking-tight text-stone-900'>Maya</span>
                    <span className='text-xs text-stone-500'>Active now</span>
                </div>
            </div>

            {/* Scroller */}
            <div className='relative flex-1 min-h-0'>
                <MessageScrollerViewport watch={`${messages.length}:${isTyping}`}>
                    <div className='flex items-center justify-center gap-3 py-1'>
                        <span className='h-px w-10 border-t border-dashed border-stone-300' />
                        <span className='text-xs text-stone-400'>Today</span>
                        <span className='h-px w-10 border-t border-dashed border-stone-300' />
                    </div>

                    {grouped.map((group: any, gi: any) => {
                        const isMe = group.sender === 'me';
                        return (
                            <Message key={gi} align={isMe ? 'end' : 'start'}>
                                <MessageAvatar>
                                    <Avatar>
                                        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                                        <AvatarFallback>{group.sender}</AvatarFallback>
                                    </Avatar>
                                </MessageAvatar>
                                <MessageContent>
                                    {!isMe && <MessageHeader>{`Maya · ${group.items[0].time}`}</MessageHeader>}
                                    <BubbleGroup className=''>
                                        {group.items.map((msg: any) => {
                                            return (
                                                <Bubble key={msg.id}>
                                                    <BubbleContent>
                                                        {msg.text}
                                                    </BubbleContent>
                                                </Bubble>
                                            )
                                        })}
                                    </BubbleGroup>
                                    {isMe && (
                                        <MessageFooter>
                                            {group.items[group.items.length - 1].time}
                                            <CheckCheck className='h-3.5 w-3.5 text-emerald-700' />
                                        </MessageFooter>
                                    )}
                                </MessageContent>
                            </Message>
                        );
                    })}

                    {isTyping && (
                        <Message align='start'>
                            {/* <MessageAvatar>
                                <Avatar>
                                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                            </MessageAvatar> */}
                            <MessageContent className='mt-4'>
                                <BubbleGroup>
                                    <Bubble>
                                        <BubbleContent>
                                            <div className='h-full flex items-center gap-1 w-fit'>
                                                <span
                                                    className='typing-dot animate-bounce size-1.5 rounded-full bg-white'
                                                    style={{ animationDelay: '-0.3s' }}
                                                />
                                                <span
                                                    className='typing-dot animate-bounce size-1.5 rounded-full bg-white'
                                                    style={{ animationDelay: '-0.15s' }}
                                                />
                                                <span className='typing-dot animate-bounce size-1.5 rounded-full bg-white' />
                                            </div>
                                        </BubbleContent>
                                    </Bubble>
                                </BubbleGroup>
                            </MessageContent>
                        </Message>
                        //                     <Marker role='status'>
                        //     <MarkerContent className='shimmer'>
                        //       <span className='font-medium'>Oliver</span> is typing...
                        //     </MarkerContent>
                        //   </Marker>
                    )}
                </MessageScrollerViewport>

                <MessageScrollerButton />
            </div>

            {/* Composer */}
            <div className='flex items-center gap-2 p-2 border-t'>
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Message Maya...'
                    aria-label='Message'
                    autoFocus
                />
                <Button
                    onClick={send}
                    disabled={!draft.trim()}
                    aria-label='Send message'
                    className='h-full'
                >
                    <Send className='h-4 w-4' />
                </Button>
            </div>
        </>
    );
}

// sizes the panel (max-width 500px, viewport-clamped height)
export const ChatBubble: React.FC = () => {
    return (
        <Popover>
            <PopoverTrigger className='absolute bottom-3 right-3'>
                <Button size={'icon-lg'}>
                    <MessageCircle />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                side='top'
                align='end'
                className='w-full max-w-lg shadow-xl overflow-hidden h-[min(600px,85vh)] p-0'
            >
                <MessageScrollerProvider>
                    <ChatPanel />
                </MessageScrollerProvider>
            </PopoverContent>
        </Popover>
    )
}