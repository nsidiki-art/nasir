---
name: llm-chatbot
description: Creates optimized LLM-powered chatbot implementations using Vercel AI SDK v6, Next.js 15, and Edge Runtime. Includes streaming API routes, performant UI components with proper state management, and error handling.
allowed-tools: Read, Write, Edit, Bash
---

# LLM Chatbot — AI SDK v6

Production-ready chatbot implementations using **Vercel AI SDK v6** (`ai` + `@ai-sdk/react`) with **Next.js 15** patterns. Each example includes:
- Streaming API route with Edge Runtime and `streamText`
- Optimized React component using `useChat` hook with `sendMessage` pattern
- Error handling, retry via `regenerate()`, and loading states
- Typing indicator (bouncing dots), auto-scroll, cleanup on unmount

## Key Dependencies

```bash
# Core AI SDK (required)
npm install ai @ai-sdk/react

# Provider SDK (pick one)
npm install @ai-sdk/openai       # OpenAI
npm install @ai-sdk/anthropic    # Anthropic
npm install @ai-sdk/google       # Gemini

# UI dependencies
npm install framer-motion react-icons
```

## AI SDK v6 API — Key Changes

> [!IMPORTANT]
> AI SDK v6 significantly changed the `useChat` hook API. The old patterns (`input`, `handleInputChange`, `handleSubmit`, `isLoading`, `initialMessages`) are **removed**.

### What Changed

| Old (v5 / pre-v6)          | New (v6)                                          |
|----------------------------|---------------------------------------------------|
| `input` from `useChat`     | Local `useState('')` for input                    |
| `handleInputChange`        | `onChange={(e) => setInput(e.target.value)}`       |
| `handleSubmit`             | `sendMessage({ text: input })`                    |
| `isLoading`                | `status` (`'ready'` / `'submitted'` / `'streaming'` / `'error'`) |
| `initialMessages`          | `messages` (via `ChatInit`)                       |
| `message.content`          | `message.parts` (array of `{ type, text }`)       |
| `reload()`                 | `regenerate()`                                    |
| `maxTokens`                | `maxOutputTokens`                                 |
| `toDataStreamResponse()`   | `toUIMessageStreamResponse()`                     |
| `Message` type             | `UIMessage` type                                  |

### useChat Hook — v6 Returns

```typescript
const {
  messages,       // UIMessage[] — chat history
  sendMessage,    // ({ text: string }) => void — send a message
  regenerate,     // () => void — retry last assistant message
  stop,           // () => void — abort current stream
  status,         // 'ready' | 'submitted' | 'streaming' | 'error'
  error,          // Error | undefined
  setMessages,    // Update messages locally
  clearError,     // Clear error state
} = useChat({
  messages: initialMessages,       // UIMessage[] — initial messages
  experimental_throttle: 50,       // Throttle UI re-renders (ms)
});
```

## Quick Start

### 1. API Route (Edge Runtime)

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: await convertToModelMessages(messages),
      system: 'You are a helpful assistant.',
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

### 2. Chatbot Component

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Hi! How can I help you?' }],
  },
];

export default function Chatbot() {
  // Local input state (AI SDK v6 — useChat no longer manages input)
  const [input, setInput] = useState('');

  const { messages, sendMessage, error, regenerate, stop, status } = useChat({
    messages: INITIAL_MESSAGES,
    experimental_throttle: 50,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  };

  // Extract text from message parts
  const getMessageText = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('') || '';
  };

  return (
    <div>
      {/* Messages */}
      {messages.map((msg) => {
        const text = getMessageText(msg);
        if (!text && msg.role === 'assistant') return null;
        return (
          <div key={msg.id}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {text}
          </div>
        );
      })}

      {/* Typing indicator */}
      {isLoading ? <div>Thinking...</div> : null}

      {/* Error with retry */}
      {error ? (
        <div>
          <p>Error occurred.</p>
          <button onClick={() => regenerate()}>Retry</button>
        </div>
      ) : null}

      <div ref={messagesEndRef} />

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'ready' && status !== 'error'}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
```

### 3. Use in Your App

```tsx
import Chatbot from '@/components/Chatbot';

export default function Page() {
  return <Chatbot />;
}
```

## UI Patterns & Improvements

### Floating Trigger Animation Fix

When using `framer-motion` for the toggle button (switching between a chat icon and a close icon), use `AnimatePresence mode="wait"`. **Crucially**, define an `exit` duration on the icons so the exit animation finishes *before* the new icon renders.

```tsx
<AnimatePresence mode="wait" initial={false}>
  {isOpen ? (
    <motion.div
      key="close"
      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.2 }} // Crucial for smooth icon swap
    >
      <FaTimes />
    </motion.div>
  ) : (
    <motion.div
      key="bot"
      // Entrance, exit, and idle bounce animations here...
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} // Must have duration
    >
      <BsRobot />
    </motion.div>
  )}
</AnimatePresence>
```

### Chat Panel Background Clarity (Dark/Light Modes)

High opacity + blur prevents page content from bleeding through and making text unreadable, especially in light mode.

```tsx
// Container mapping to the Chat Window
<div className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl">
  {/* Content */}
</div>
```

### Input Field Design (The "Pill")

A modern, rounded pill design performs better for chat interfaces than traditional square inputs.

```tsx
<input
  type="text"
  placeholder="Ask about my skills or services..."
  className="w-full bg-secondary/50 focus:bg-secondary border border-border/50 focus:border-primary/50 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
/>
```

### Performance-Optimized Message Streaming

When text streams from the LLM, the layout continuously shifts. Using standard `framer-motion` (especially with the `layout` prop) on every message bubble will cause severe performance degradation and "bouncing" text. 

**Best Practice:** Use pure CSS animations for entering messages instead of `motion.div`.

```css
/* In globals.css */
@keyframes chatFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
// Inside messages.map() in Chatbot.tsx
// ✅ Use standard divs with CSS animations instead of motion.div
<div 
  key={message.id} 
  className="flex justify-start"
>
  <div 
    className="bg-card px-5 py-3 shadow-md rounded-2xl"
    style={{ animation: 'chatFadeIn 0.3s ease-out' }}
  >
    {text}
  </div>
</div>
```

### Typing Indicator (Bouncing Dots)

Show a high-quality bouncing dots animation in two distinct phases. Phase 1: Request is submitted but no internal message context exists yet. Phase 2: The assistant message exists in the UI but hasn't streamed text yet.

```tsx
// Phase 1: Standalone UI element at the bottom of the chat list
{status === "submitted" && messages[messages.length - 1]?.role === "user" ? (
  <div className="flex justify-start">
    <div className="bg-card rounded-2xl px-5 py-4 shadow-md">
      <div className="flex gap-2 items-center h-4">
        <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" />
      </div>
    </div>
  </div>
) : null}

// Phase 2: Rendered inside the assistant's message bubble while 'showDots' is true
// const showDots = !text && isAssistant && isLoading;
{showDots ? (
  <div className="flex gap-2 items-center h-4 py-1" style={{ animation: 'chatFadeIn 0.2s ease-out' }}>
    <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
    {/* ... remaining dots ... */}
  </div>
) : (
  <p>{text}</p>
)}
```

### Streaming Markdown Integration

Use `react-markdown` to safely render the Markdown streams emitted by the LLM. Apply custom styling via the `components` prop to ensure links and lists look good inside the chat bubble.

```tsx
import ReactMarkdown from "react-markdown";

<ReactMarkdown
  components={{
    a: ({ href, children }) => (
      <a href={href || "#"} className="text-accent hover:underline font-semibold" target="_blank">
        {children}
      </a>
    ),
    p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-1.5">{children}</ul>,
  }}
>
  {text}
</ReactMarkdown>
```

### Error Bubble Styling

Handle errors gracefully with an integrated bubble matching the chat layout, styled cleanly for both Light/Dark modes using Tailwind:

```tsx
{error && (
  <div className="flex justify-start">
    <div className="max-w-[85%] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 rounded-2xl px-5 py-3 shadow-md">
      <p className="text-sm font-medium mb-2">Something went wrong.</p>
      <button
        onClick={() => regenerate()}
        className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-200 px-3 py-1.5 rounded-full transition-colors font-medium"
      >
        ↻ Retry
      </button>
    </div>
  </div>
)}
```

### Client-Side Greeting Interception

For simple greetings ("Hi", "Assalamualikum"), skip the LLM entirely. Instead:
1. Append the user message + an **empty** bot message to `messages` via `setMessages`.
2. Set `isSimulating = true` to activate typing dots (since `isLoading` won't be `true`).
3. After a random 500–1000ms thinking delay, stream the reply character by character with `setInterval`.

```tsx
// In component state
const [isSimulating, setIsSimulating] = useState(false);
const isLoading = status === 'submitted' || status === 'streaming' || isSimulating;

// Greeting variants — expand this list to handle misspellings
const greetingMatches = [
  'hi', 'hello', 'hey', 'salam', 'assalamualikum', 'assalamu alaikum',
  'greetings', 'assalmualikum', 'asalamualikum', 'asalam', 'assalam',
];

// Check for exact match OR starts-with (e.g., "hi there")
const isGreeting = greetingMatches.some(g =>
  lowerInput === g || lowerInput.startsWith(g + ' ')
);

if (isGreeting) {
  setInput('');
  const botMessageId = `bot-${Date.now()}`;
  setMessages([...messages,
    { id: `user-${Date.now()}`, role: 'user', parts: [{ type: 'text', text: trimmed }] },
    { id: botMessageId,       role: 'assistant', parts: [{ type: 'text', text: '' }] },
  ]);
  setIsSimulating(true);

  const reply = lowerInput.includes('salam') ? 'Walaikum Assalam! 👋' : 'Hi there! 👋';
  const delay = Math.floor(Math.random() * 500) + 500; // 500–1000ms

  setTimeout(() => {
    let i = 0, built = '';
    const interval = setInterval(() => {
      if (i < reply.length) {
        built += reply[i++];
        setMessages(prev => prev.map(m =>
          m.id === botMessageId ? { ...m, parts: [{ type: 'text', text: built }] } : m
        ));
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 15);
  }, delay);
  return;
}
```

### Keeping the Chat Open on Link Clicks

**Do NOT add `onClick={() => setIsOpen(false)}` to links inside messages.** This was a common mistake — links inside the chat message markdown should navigate the page (via `next/link`) without closing the chat panel.

```tsx
// ✅ Good — chat stays open when link is clicked
a: ({ href, children }) => (
  <Link href={href || '#'} className="text-accent hover:underline font-semibold">
    {children}
  </Link>
),

// ❌ Bad — clicking a link slams the chat closed
a: ({ href, children }) => (
  <Link href={href || '#'} onClick={() => setIsOpen(false)}>
    {children}
  </Link>
),
```

### Reliable Scroll-to-Bottom

Using `scrollIntoView` on a `messagesEndRef` inside a custom scrollable container can be unreliable. Instead, attach a `ref` directly to the scrollable div and set `scrollTop = scrollHeight`.

```tsx
const scrollContainerRef = useRef<HTMLDivElement>(null);

// Trigger after every messages update
useEffect(() => {
  const el = scrollContainerRef.current;
  if (el) el.scrollTop = el.scrollHeight; // instant, always accurate
}, [messages]);

// Attach to the scrollable messages container
<div ref={scrollContainerRef} className="flex-1 overflow-y-auto ...">
  {/* messages */}
</div>
```

## Performance Checklist

- [x] Edge Runtime for API routes (`export const runtime = 'edge'`)
- [x] `experimental_throttle: 50` to batch UI re-renders during streaming
- [x] Local `useState` for input (not from useChat)
- [x] `stop()` cleanup in `useEffect` return
- [x] Scroll-to-bottom via `scrollContainerRef` + `scrollTop = scrollHeight`
- [x] Focus management on chat open
- [x] No `layout` prop on streaming message elements
- [x] Ternary operators for conditional rendering (not `&&`)
- [x] Client-side greeting intercept skips LLM for simple greetings
- [x] `isSimulating` state to unify loading state for real + fake messages


## Error Handling

1. **`error` from useChat** — Display error banner with retry button
2. **`regenerate()`** — Retry the last assistant response
3. **`stop()`** — Abort current streaming request
4. **`clearError()`** — Reset error state to `'ready'`
5. **API try/catch** — Return JSON error responses from the API route

## Accessibility Checklist

- [x] `aria-label` for icon buttons (open/close/send)
- [x] Focus input when chat opens
- [x] Keyboard submit via Enter key
- [x] Disabled state styling for input/buttons during loading
- [x] Error messages with actionable retry

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `input` not in useChat | AI SDK v6 change | Use local `useState` for input |
| `handleSubmit` missing | AI SDK v6 change | Use `sendMessage({ text })` |
| `reload` missing | AI SDK v6 rename | Use `regenerate()` |
| `maxTokens` error | AI SDK v6 rename | Use `maxOutputTokens` |
| `toDataStreamResponse` error | AI SDK v6 change | Use `toUIMessageStreamResponse()` |
| Bubble bouncing on stream | Framer Motion `layout` | Remove `layout` prop from messages |
| Empty bubble, no dots | Dots too small/faint | Use `w-2.5 h-2.5 bg-accent` |
| Send button disabled | `input` from old API | Use local `useState` for input |
| Type comparison error | Narrow initial messages type | Type as `UIMessage[]` explicitly |
| Greeting triggers LLM | Exact match too strict | Use `.some()` with `startsWith` check |
| Chat closes on link click | `onClick` on link removes panel | Remove `onClick` from markdown links |
| Scroll doesn't reach bottom | `scrollIntoView` unreliable in overflow div | Use `scrollContainerRef` + `scrollTop = scrollHeight` |

## References

- [AI SDK v6 Docs](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [useChat Reference](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat)
- Vercel React Best Practices — See `../vercel-react-best-practices/SKILL.md`
