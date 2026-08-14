"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTour, TOUR_STEPS } from "../context/TourContext";
import { X, ChevronRight, Plus } from "lucide-react";

export function ProductTour() {
  const { isTourActive, currentStepIndex, nextStep, closeTour, currentStep } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!isTourActive) return;

    const updateRect = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
      if (currentStep) {
        const el = document.getElementById(currentStep.targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Add a small padding around the target element
          const rect = el.getBoundingClientRect();
          const padding = 4;
          setTargetRect({
            x: rect.x - padding,
            y: rect.y - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
            top: rect.top - padding,
            bottom: rect.bottom + padding,
            left: rect.left - padding,
            right: rect.right + padding,
            toJSON: rect.toJSON,
          });
        }
      }
    };

    updateRect();

    // Poll just in case of layout shifts
    const interval = setInterval(updateRect, 500);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isTourActive, currentStep]);

  if (!isTourActive || !currentStep || !targetRect) return null;

  // Calculate Popover Position
  const popoverWidth = 320;
  let popoverStyle: any = { width: popoverWidth };
  let triangleClass = "";

  if (currentStep.placement === "right") {
    popoverStyle.left = targetRect.right + 12;
    if (targetRect.top > windowSize.h / 2) {
      popoverStyle.bottom = Math.max(16, windowSize.h - targetRect.bottom);
      triangleClass = "right-full bottom-[20px] border-r-[#222] border-t-transparent border-b-transparent border-y-8 border-r-8";
    } else {
      popoverStyle.top = targetRect.top + targetRect.height / 2 - 50; // roughly centered
      triangleClass = "right-full top-[30px] border-r-[#222] border-t-transparent border-b-transparent border-y-8 border-r-8";
    }
  } else if (currentStep.placement === "left") {
    popoverStyle.right = windowSize.w - targetRect.left + 12;
    if (targetRect.top > windowSize.h / 2) {
      popoverStyle.bottom = Math.max(16, windowSize.h - targetRect.bottom);
      triangleClass = "left-full bottom-[20px] border-l-[#222] border-t-transparent border-b-transparent border-y-8 border-l-8";
    } else {
      popoverStyle.top = targetRect.top + targetRect.height / 2 - 50;
      triangleClass = "left-full top-[30px] border-l-[#222] border-t-transparent border-b-transparent border-y-8 border-l-8";
    }
  } else if (currentStep.placement === "top") {
    popoverStyle.left = Math.max(16, Math.min(windowSize.w - popoverWidth - 16, targetRect.left + targetRect.width / 2 - popoverWidth / 2));
    popoverStyle.bottom = windowSize.h - targetRect.top + 12;
    // ensure triangle centers accurately despite constrained left offset
    const leftOffset = targetRect.left + targetRect.width / 2 - popoverStyle.left;
    triangleClass = "top-full border-t-[#222] border-l-transparent border-r-transparent border-x-8 border-t-8";
    // We apply left manually to triangle later
  } else if (currentStep.placement === "bottom") {
    popoverStyle.left = Math.max(16, Math.min(windowSize.w - popoverWidth - 16, targetRect.left + targetRect.width / 2 - popoverWidth / 2));
    popoverStyle.top = targetRect.bottom + 12;
    triangleClass = "bottom-full border-b-[#222] border-l-transparent border-r-transparent border-x-8 border-b-8";
  }

  // Bound checks for left/top standard placements
  if (popoverStyle.left !== undefined) {
    if (popoverStyle.left + popoverWidth > windowSize.w) popoverStyle.left = windowSize.w - popoverWidth - 16;
    if (popoverStyle.left < 16) popoverStyle.left = 16;
  }
  if (popoverStyle.top !== undefined && popoverStyle.top < 16) popoverStyle.top = 16;

  const overlayClass = "fixed bg-black/40 backdrop-blur-sm z-[150] pointer-events-auto transition-all duration-300";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] pointer-events-none">

        {/* 4-part overlay to create a "hole" over the target element for blurring */}
        <div className={overlayClass} style={{ top: 0, left: 0, right: 0, height: targetRect.top }} />
        <div className={overlayClass} style={{ top: targetRect.bottom, left: 0, right: 0, bottom: 0 }} />
        <div className={overlayClass} style={{ top: targetRect.top, height: targetRect.height, left: 0, width: targetRect.left }} />
        <div className={overlayClass} style={{ top: targetRect.top, height: targetRect.height, left: targetRect.right, right: 0 }} />

        {/* The Popover */}
        <motion.div
          key={currentStep.targetId}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={popoverStyle}
          className="absolute z-[160] pointer-events-auto dark:bg-[#000]/60 border-2 border-white/5 bg-[#000] backdrop-blur-md rounded-2xl p-5 shadow-2xl text-white font-sans"
        >
          {/* Triangle pointing to target */}
          <div
            className={`absolute w-0 h-0 border-solid ${triangleClass}`}
            style={(currentStep.placement === "top" || currentStep.placement === "bottom")
              ? { left: Math.max(16, targetRect.left + targetRect.width / 2 - (popoverStyle.left || 0)) }
              : {}
            }
          ></div>

          <button
            onClick={closeTour}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="w-10 h-10 flex items-center mb-4">
            <img src="/logo/logo-01.png" alt="Norest" className="w-[32px] h-[32px] object-contain invert brightness-0" />
          </div>

          <h3 className="text-[18px] font-semibold mb-2">{currentStep.title}</h3>
          <p className="text-[15px] text-gray-300 leading-relaxed mb-6">
            {currentStep.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <span className="text-[14px] text-gray-400 font-medium">
              {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={nextStep}
              className="bg-white cursor-pointer text-black px-4 py-2 rounded-full font-semibold text-[14px] hover:bg-gray-200 transition-colors"
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
