"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface NotificationPopupProps {
  type: "success" | "error" | null;
  message: string;
  onClose: () => void;
  duration?: number; // auto-dismiss duration in ms, default 5000
}

export function NotificationPopup({
  type,
  message,
  onClose,
  duration = 5000,
}: NotificationPopupProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (!type) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [type, duration, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />

          {/* Popup Card */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className={`
                pointer-events-auto relative w-full max-w-sm rounded-2xl overflow-hidden
                bg-card/95 backdrop-blur-xl
                shadow-[0_24px_64px_rgba(0,0,0,0.3)]
                border ${isSuccess ? "border-accent/30" : "border-destructive/30"}
              `}
            >
              {/* Top gradient bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isSuccess
                    ? "bg-gradient-to-r from-transparent via-accent to-transparent"
                    : "bg-gradient-to-r from-transparent via-destructive to-transparent"
                }`}
              />

              {/* Ambient glow */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 -z-0 ${
                  isSuccess ? "bg-accent" : "bg-destructive"
                }`}
              />

              <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isSuccess
                          ? "bg-accent/15 text-accent"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <XCircle className="w-5 h-5" strokeWidth={2.5} />
                      )}
                    </motion.div>

                    {/* Title */}
                    <div>
                      <h3 className="font-montserrat font-bold text-foreground text-base tracking-wide">
                        {isSuccess ? "Message Sent!" : "Something went wrong"}
                      </h3>
                      <p className={`text-xs font-medium mt-0.5 ${isSuccess ? "text-accent" : "text-destructive"}`}>
                        {isSuccess ? "We'll be in touch soon" : "Please try again"}
                      </p>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    onClick={onClose}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-4 text-sm text-muted-foreground leading-relaxed"
                >
                  {message}
                </motion.p>

                {/* Progress bar */}
                <motion.div
                  className="mt-4 h-[3px] rounded-full overflow-hidden bg-border/50"
                >
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    className={`h-full rounded-full ${isSuccess ? "bg-accent" : "bg-destructive"}`}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
