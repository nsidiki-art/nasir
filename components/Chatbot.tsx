"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text", text: "Hi! I'm Nasir's AI assistant. Ask me anything about his skills, projects, or services!" }],
  },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Local input state (AI SDK v6 pattern)
  const [input, setInput] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Theme
  const { theme, setTheme } = useTheme();

  const {
    messages,
    sendMessage,
    error,
    regenerate,
    stop,
    status,
    setMessages,
  } = useChat({
    messages: INITIAL_MESSAGES,
    // Throttle UI updates to 50ms to reduce excessive re-renders during streaming
    experimental_throttle: 50,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming" || isSimulating;

  // Auto-scroll to bottom when new messages arrive or stream
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Mounted state for theme toggle hydration safety
  useEffect(() => setMounted(true), []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup: stop streaming on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Handle form submit with client-side greeting intercept
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Check for simple greetings to handle client-side (save LLM latency/cost)
    const lowerInput = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, ""); // strip punctuation
    
    // Comprehensive array to catch misspellings and variations
    const greetingMatches = [
      "hi", "hello", "hey", "salam", "assalamualikum", "assalamoalikum", "assalamu alaikum", "assalamo alaikum", 
      "greetings", "assalmualikum", "asalamualikum", "asalam", "assalam", "hi there", "hello there"
    ];
    
    // Check if input strictly is a greeting, or starts with a greeting (e.g., "hi nasir")
    const isGreeting = greetingMatches.some(g => 
      lowerInput === g || lowerInput.startsWith(g + " ")
    );
    
    if (isGreeting) {
      setInput("");
      
      const fakeUserMessage: UIMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text: trimmed }]
      };
      
      let botReply = "Hi there! 👋 How can I help you today?";
      if (lowerInput.includes("salam") || lowerInput.includes("assalam") || lowerInput.includes("asalam")) {
        botReply = "Walaikum Assalam! 👋 How can I help you today?";
      }

      const botMessageId = `bot-${Date.now()}`;
      const emptyBotMessage: UIMessage = {
        id: botMessageId,
        role: "assistant",
        parts: [{ type: "text", text: "" }]
      };
      
      // Append user message and empty bot message to trigger loading dots
      setMessages([...messages, fakeUserMessage, emptyBotMessage]);
      setIsSimulating(true);

      // Simulate thinking delay (500-1000ms)
      const thinkingDelay = Math.floor(Math.random() * 500) + 500;
      
      setTimeout(() => {
        let currentText = "";
        const chars = botReply.split("");
        let charIndex = 0;
        
        // Artificial streaming effect
        const streamInterval = setInterval(() => {
          if (charIndex < chars.length) {
            currentText += chars[charIndex];
            setMessages((prev) => 
              prev.map(msg => 
                msg.id === botMessageId 
                  ? { ...msg, parts: [{ type: "text", text: currentText }] }
                  : msg
              )
            );
            charIndex++;
          } else {
            clearInterval(streamInterval);
            setIsSimulating(false);
          }
        }, 15); // Adjust for typing speed
      }, thinkingDelay);

      return;
    }

    // Normal LLM flow
    sendMessage({ text: trimmed });
    setInput("");
  };

  // Helper to get text content from a message
  const getMessageText = (message: typeof messages[0]) => {
    return message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => (part as { type: "text"; text: string }).text)
      .join("") || "";
  };

  return (
    <>
      {/* Floating Button — Premium Animated Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulsing glow ring behind the button */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-theme-gradient opacity-40 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.15, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: isOpen ? 0 : [0, -6, 0],
          }}
          transition={isOpen ? { type: "spring", stiffness: 260, damping: 20 } : {
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 260, damping: 20, duration: 0.4 },
            opacity: { duration: 0.4 },
          }}
          whileHover={{
            scale: 1.12,
            rotate: isOpen ? 0 : [0, -8, 8, 0],
            transition: {
              scale: { type: "spring", stiffness: 400, damping: 15 },
              rotate: { duration: 0.5, ease: "easeInOut" },
            },
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-primary hover:bg-primary/90 shadow-[0_4px_24px_rgba(254,205,26,0.3)] ring-1 ring-black/10"
              : "bg-theme-gradient shadow-[0_4px_24px_rgba(254,205,26,0.4)] hover:shadow-[0_4px_32px_rgba(254,205,26,0.6)] border border-white/20"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center text-black"
              >
                <FaTimes size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                animate={{
                  rotate: [0, -12, 12, -8, 8, 0],
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ 
                  rotate: -90, 
                  opacity: 0, 
                  scale: 0.5,
                  transition: { duration: 0.2 } 
                }}
                transition={{
                  rotate: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center justify-center text-black"
              >
                <BsRobot size={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-[400px] h-[75vh] max-h-[600px] z-50 flex flex-col"
          >
            <div className="bg-transparent overflow-hidden flex flex-col h-full rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] ring-1 ring-border/50">
              {/* Header */}
              <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 p-4 relative overflow-hidden shrink-0 rounded-t-2xl">
                <div className="absolute inset-0 bg-theme-gradient opacity-[0.03] pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(254,205,26,0.3)] group-hover:shadow-[0_0_20px_rgba(254,205,26,0.5)] transition-all">
                        <BsRobot className="text-black text-lg" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-foreground tracking-wide">
                        AI Assistant
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        {status === "streaming" || (isSimulating && messages.length > 0 && getMessageText(messages[messages.length - 1]).length > 0) ? (
                          "Typing..."
                        ) : status === "submitted" || isSimulating ? (
                          "Thinking..."
                        ) : (
                          "Ask about My Skills & services"
                        )}
                      </p>
                    </div>
                  </div>
                  {/* Theme Toggle */}
                  {mounted ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 dark:bg-white/5 border border-border/50 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                      aria-label="Toggle theme"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                          <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Sun className="h-4 w-4 text-yellow-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="moon"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Moon className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ) : null}
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 [scrollbar-width:thin] bg-card/95 backdrop-blur-md">
                <AnimatePresence initial={false}>
                  {messages.map((message) => {
                    const text = getMessageText(message);
                    const isAssistant = message.role === "assistant";

                    // Skip empty assistant messages that aren't loading (and aren't welcome)
                    if (!text && isAssistant && !isLoading) return null;
                    // Skip empty welcome message if somehow empty
                    if (!text && isAssistant && message.id === "welcome") return null;

                    const showDots = !text && isAssistant && isLoading;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] px-5 py-3 shadow-sm ${
                            message.role === "user"
                              ? "bg-primary text-black rounded-t-2xl rounded-l-2xl rounded-br-sm"
                              : "bg-card text-foreground rounded-t-2xl rounded-r-2xl rounded-bl-sm shadow-md"
                          }`}
                        >
                          {showDots ? (
                            <div className="flex gap-2 items-center h-4 py-1" style={{ animation: 'chatFadeIn 0.2s ease-out' }}>
                              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                              <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" />
                            </div>
                          ) : isAssistant ? (
                            <div className="text-sm leading-relaxed font-medium prose-chat" style={{ animation: 'chatFadeIn 0.3s ease-out' }}>
                              <ReactMarkdown
                                components={{
                                  a: ({ href, children }) => (
                                    <Link
                                      href={href || "#"}
                                      className="text-accent hover:underline font-semibold transition-colors"
                                    >
                                      {children}
                                    </Link>
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-1.5 last:mb-0">{children}</p>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-bold text-foreground">{children}</strong>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-inside mb-1.5 space-y-0.5">{children}</ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-inside mb-1.5 space-y-0.5">{children}</ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="text-sm">{children}</li>
                                  ),
                                }}
                              >
                                {text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                              {text}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator for "submitted" phase only (before assistant message exists in array) */}
                  {status === "submitted" && messages[messages.length - 1]?.role === "user" ? (
                    <div className="flex justify-start">
                      <div className="bg-card text-foreground rounded-t-2xl rounded-r-2xl rounded-bl-sm px-5 py-4 shadow-md">
                        <div className="flex gap-2 items-center h-4">
                          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Error display with retry */}
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 rounded-2xl px-5 py-3 shadow-md">
                        <p className="text-sm font-medium mb-2">
                          Something went wrong. Please try again.
                        </p>
                        <button
                          onClick={() => regenerate()}
                          className="text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-200 px-3 py-1.5 rounded-full transition-colors font-medium"
                        >
                          ↻ Retry
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-2" />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-card shrink-0 rounded-b-2xl border-t border-border/50">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about my skills or services..."
                    disabled={status !== "ready" && status !== "error"}
                    className="flex-1 bg-secondary/50 focus:bg-secondary border border-border/50 focus:border-primary/50 rounded-full px-5 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: (isLoading || !input.trim()) ? 1 : 1.05 }}
                    whileTap={{ scale: (isLoading || !input.trim()) ? 1 : 0.95 }}
                    className="bg-theme-gradient text-black flex items-center justify-center w-[46px] h-[46px] shrink-0 rounded-full shadow-[0_0_15px_rgba(254,205,26,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity border border-black/10"
                    aria-label="Send message"
                  >
                    <FaPaperPlane className="text-sm relative right-[1px]" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
