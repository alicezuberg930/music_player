import { MessageCircle } from "@yukikaze/ui";
import { Button } from "@yukikaze/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@yukikaze/ui/popover";
import { useState, useRef } from "react";
import { Send, CheckCheck } from "@yukikaze/ui";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@yukikaze/ui/message";
import { Bubble, BubbleContent, BubbleGroup } from "@yukikaze/ui/bubble";
import { Avatar, AvatarFallback, AvatarImage } from "@yukikaze/ui/avatar";
import { Input } from "@yukikaze/ui/input";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@yukikaze/ui/message-scroller";

// Fake data — a two-person thread about weekend trail plans
const initialMessages = [
  {
    id: 1,
    sender: "them",
    text: "hey!! are we still on for the trail saturday?",
    time: "2:12 PM",
  },
  {
    id: 2,
    sender: "them",
    text: "just checked, weather looks clear all day",
    time: "2:12 PM",
  },
  {
    id: 3,
    sender: "me",
    text: "yesss, been looking forward to this all week",
    time: "2:14 PM",
  },
  {
    id: 4,
    sender: "me",
    text: "what time were you thinking?",
    time: "2:14 PM",
  },
  {
    id: 5,
    sender: "them",
    text: "maybe 8am? beats the heat and the crowds",
    time: "2:15 PM",
  },
  {
    id: 6,
    sender: "them",
    text: 'lot fills up fast on weekends if we"re not early',
    time: "2:16 PM",
  },
  {
    id: 7,
    sender: "me",
    text: "8 works. is it dog friendly? thinking of bringing Biscuit",
    time: "2:17 PM",
  },
  {
    id: 8,
    sender: "me",
    text: 'he"s been dying to get out of the apartment lol',
    time: "2:17 PM",
  },
  {
    id: 9,
    sender: "them",
    text: "yes bring him!! just leash him for the first mile, it gets narrow near the creek",
    time: "2:18 PM",
  },
  {
    id: 10,
    sender: "me",
    text: 'perfect, he"s gonna lose his mind',
    time: "2:19 PM",
  },
  {
    id: 11,
    sender: "me",
    text: "lunch after, or just snacks on the trail?",
    time: "2:19 PM",
  },
  {
    id: 12,
    sender: "them",
    text: "snacks on the trail, then that taco place after? the one with the good horchata",
    time: "2:20 PM",
  },
  {
    id: 13,
    sender: "me",
    text: "oh you remembered 😂 say less",
    time: "2:22 PM",
  },
  {
    id: 14,
    sender: "them",
    text: 'of course lol. I"ll bring trail mix and extra water, can you grab sunscreen?',
    time: "2:23 PM",
  },
  { id: 15, sender: "me", text: "yep, got it covered", time: "2:24 PM" },
  { id: 16, sender: "me", text: "see you saturday!! 🥾", time: "2:24 PM" },
  { id: 17, sender: "them", text: 'can"t wait!! 🐾', time: "2:25 PM" },
];

const replyPool = [
  "haha yesss",
  "wait totally agree",
  "no way, really?",
  'I"m so down for that',
  "same tbh 😂",
  'can"t wait for this',
  "omg say less",
];

const makeStartClock = () => {
  const d = new Date();
  d.setHours(14, 27, 0, 0);
  return d;
};

// Chat panel — composes Message + MessageScroller, owns conversation state
const ChatPanel = () => {
  const { scrollToEnd } = useMessageScroller();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const clockRef = useRef(makeStartClock());
  const replyIndexRef = useRef(0);

  const nextTime = () => {
    clockRef.current = new Date(
      clockRef.current.getTime() + 60000 * (1 + Math.floor(Math.random() * 2)),
    );
    return clockRef.current.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), sender: "me", text, time: nextTime() },
    ]);
    setDraft("");
    window.requestAnimationFrame(() => scrollToEnd({ behavior: "smooth" }));
    setIsTyping(true);
    const delay = 900 + Math.random() * 900;
    window.setTimeout(() => {
      setIsTyping(false);
      const reply = replyPool[replyIndexRef.current % replyPool.length];
      replyIndexRef.current += 1;
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, sender: "them", text: reply, time: nextTime() },
      ]);
    }, delay);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
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
      <div className="flex items-center gap-3 border-b p-2">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-orange-800 text-white flex items-center justify-center text-sm font-semibold">
            M
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-stone-50" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-stone-900">
            Maya
          </span>
          <span className="text-xs text-stone-500">Active now</span>
        </div>
      </div>

      {/* Scroller */}
      <div className="relative flex-1 min-h-0">
        <MessageScroller>
          <MessageScrollerViewport className="px-4 py-4">
            <MessageScrollerContent className="gap-3">
              <MessageScrollerItem>
                <div className="flex items-center justify-center gap-3 py-1">
                  <span className="h-px w-10 border-t border-dashed border-stone-300" />
                  <span className="text-xs text-stone-400">Today</span>
                  <span className="h-px w-10 border-t border-dashed border-stone-300" />
                </div>
              </MessageScrollerItem>

              {grouped.map((group: any) => {
                const isMe = group.sender === "me";
                const firstMessage = group.items[0];
                return (
                  <MessageScrollerItem
                    key={firstMessage.id}
                    messageId={`${firstMessage.id}`}
                    scrollAnchor
                  >
                    <Message align={isMe ? "end" : "start"}>
                      <MessageAvatar>
                        <Avatar>
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>{group.sender}</AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        {!isMe && (
                          <MessageHeader>{`Maya · ${firstMessage.time}`}</MessageHeader>
                        )}
                        <BubbleGroup className="">
                          {group.items.map((msg: any) => {
                            return (
                              <Bubble key={msg.id}>
                                <BubbleContent>{msg.text}</BubbleContent>
                              </Bubble>
                            );
                          })}
                        </BubbleGroup>
                        {isMe && (
                          <MessageFooter>
                            {group.items[group.items.length - 1].time}
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-700" />
                          </MessageFooter>
                        )}
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                );
              })}

              {isTyping && (
                <MessageScrollerItem messageId="typing" scrollAnchor>
                  <Message align="start">
                    {/* <MessageAvatar>
                                <Avatar>
                                    <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                            </MessageAvatar> */}
                    <MessageContent className="mt-4">
                      <BubbleGroup>
                        <Bubble>
                          <BubbleContent>
                            <div className="h-full flex items-center gap-1 w-fit">
                              <span
                                className="typing-dot animate-bounce size-1.5 rounded-full bg-white"
                                style={{ animationDelay: "-0.3s" }}
                              />
                              <span
                                className="typing-dot animate-bounce size-1.5 rounded-full bg-white"
                                style={{ animationDelay: "-0.15s" }}
                              />
                              <span className="typing-dot animate-bounce size-1.5 rounded-full bg-white" />
                            </div>
                          </BubbleContent>
                        </Bubble>
                      </BubbleGroup>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
                //                     <Marker role='status'>
                //     <MarkerContent className='shimmer'>
                //       <span className='font-medium'>Oliver</span> is typing...
                //     </MarkerContent>
                //   </Marker>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>

          <MessageScrollerButton className="bottom-3 start-auto end-3 translate-x-0 rounded-full bg-stone-50 border-stone-200 shadow-md hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2 rtl:translate-x-0" />
        </MessageScroller>
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 p-2 border-t">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Maya..."
          aria-label="Message"
          autoFocus
        />
        <Button
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Send message"
          className="h-full"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

// sizes the panel (max-width 500px, viewport-clamped height)
export const ChatBubble: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger className="absolute bottom-3 right-3">
        <Button size={"icon-lg"}>
          <MessageCircle />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        className="w-full max-w-lg shadow-xl overflow-hidden h-[min(600px,85vh)] p-0"
      >
        <MessageScrollerProvider autoScroll defaultScrollPosition="end">
          <ChatPanel />
        </MessageScrollerProvider>
      </PopoverContent>
    </Popover>
  );
};
