"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, PanInfo, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { X, Maximize2, ArrowUp, User } from "lucide-react";

export function HelpButton() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 1000 });
  const [isOpen, setIsOpen] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);

  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      setIsDraggable(false); // turn off drag mode when it returns
    }, 3000);
  };

  const handleDragStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTap = () => {
    if (isOpen) return;

    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 1) {
        // Single tap -> Open Chat
        if (!isOpen) {
          setIsOpen(true);
          setIsDraggable(false);
          controls.start({ x: 0, y: 0 }); // reset position in background
        }
      } else if (clickCount.current >= 2) {
        // Double tap -> Enable Drag Mode
        setIsDraggable(true);
        controls.start({ scale: 1.15, transition: { duration: 0.1 } }).then(() => {
          controls.start({ scale: 1, transition: { duration: 0.1 } });
        });
      }
      clickCount.current = 0;
    }, 300); // 300ms window to count clicks
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-sm transition-all"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="ball"
            drag={isDraggable}
            dragConstraints={{ 
              left: -(windowSize.w - 360), 
              right: 0, 
              top: -(windowSize.h - 220), 
              bottom: 0 
            }}
            dragElastic={0.8}
            dragMomentum={true}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 3 }}
            initial={{ opacity: 1, scale: 1 }}
            animate={controls}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            id="tour-help-button"
            className={`fixed bottom-6 right-6 z-[100] cursor-pointer w-14 h-14 rounded-full bg-black dark:bg-white shadow-xl shadow-black/20 dark:shadow-white/10 border border-transparent flex items-center justify-center select-none touch-none ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center rounded-full pointer-events-none"
            >
              <img
                src="/logo/logo-01.png"
                alt="Help"
                className="w-7 h-7 object-contain invert brightness-0 dark:invert-0 dark:brightness-0 pointer-events-none"
              />
            </motion.div>
          </motion.div>
        )}
        
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0, x: "40%", y: "40%", skewX: 20, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0, skewX: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.2, x: "40%", y: "40%", skewY: 15, rotate: 10, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.4 }}
              className="w-[380px] h-[600px] max-h-[90vh] bg-white dark:bg-[#000] rounded-[24px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
            >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 pb-2">


              <div className="flex flex-col items-left">
                <h2 className="text-md font-semibold text-black dark:text-white leading-tight">Norest Assistant</h2>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-black dark:text-white hover:opacity-70 transition-opacity"
              >
                <X size={28} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 relative">
              <div className="text-center">
                <span className="text-xs font-medium text-black dark:text-white">6 minutes ago</span>
              </div>

              {/* Jason Message 1 */}
              <div className="flex relative z-10">
                <div className="bg-blue-600 dark:bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-bl-sm text-[14px] leading-relaxed max-w-[85%] shadow-sm relative z-10">
                  Good morning, I'm Jason from Customer Care. How may I help you?
                </div>
              </div>

              {/* User Message 1 */}
              <div className="flex justify-end relative z-10">
                <div className="bg-gray-100 dark:bg-white/10 text-black dark:text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-[14px] leading-relaxed max-w-[85%] shadow-sm relative z-10">
                  Hi Jason, I have a problem with placing my order.
                </div>
              </div>

              {/* Jason Message 2 */}
              <div className="flex relative z-10">
                <div className="bg-blue-600 dark:bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-bl-sm text-[14px] leading-relaxed max-w-[85%] shadow-sm relative z-10">
                  I'm sorry to hear that. Let's see where it goes wrong. Are you able to place items in your cart?
                </div>
              </div>

              {/* Background decorative circles to match design */}
              <div className="absolute top-10 left-10 w-24 h-24 bg-blue-50 dark:bg-white/5 rounded-full z-0 blur-xl"></div>
              <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-50 dark:bg-white/5 rounded-full z-0 blur-xl"></div>
            </div>

            {/* Chat Input */}
            <div className="p-6 pt-2">
              <div className="relative flex items-center bg-transparent border-2 border-gray-200 dark:border-white/10 rounded-full p-1 focus-within:border-gray-300 dark:focus-within:border-gray-500 transition-colors">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent px-4 text-[14px] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none font-medium"
                />
                <button className="w-8 h-8 rounded-full bg-black dark:bg-blue-600 hover:bg-gray-800 transition-colors flex items-center justify-center shrink-0">
                  <ArrowUp size={16} className="text-white stroke-[2.5]" />
                </button>
              </div>
            </div>

          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
