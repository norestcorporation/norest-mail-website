"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Placement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  placement: Placement;
}

export const TOUR_STEPS: TourStep[] = [
  {
    targetId: "tour-product-bar",
    title: "Hop Around! 🦘",
    description: "Quickly jump between Mail, Calendar, and your other favorite Norest apps right here. It's your global teleport station!",
    placement: "right",
  },
  {
    targetId: "tour-compose",
    title: "Say Hello! 👋",
    description: "Ready to write a masterpiece? Click here to draft new emails in a flash with our super-powered editor with AI features.",
    placement: "right",
  },
  {
    targetId: "tour-folders",
    title: "Your Neat Little Hub 📁",
    description: "Keep things tidy! All your inbox, drafts, and custom folders live here. Organization has never felt so cozy.",
    placement: "right",
  },
  {
    targetId: "tour-labels",
    title: "Color Your World 🎨",
    description: "Tag your emails for ultimate clarity! These little guys automatically look stunning in both light and dark modes.",
    placement: "right",
  },
  {
    targetId: "tour-message-list",
    title: "Your Beautiful Inbox 💌",
    description: "Here’s where the magic happens. Zip through your messages at lightning speed - no clutter, just pure focus!",
    placement: "right",
  },
  {
    targetId: "tour-header",
    title: "Find Anything, Fast! 🕵️‍♀️",
    description: "Looking for that one email from last year? Just type it here and watch our blazing fast search find it instantly.",
    placement: "bottom",
  },
  {
    targetId: "tour-plan",
    title: "You're a VIP! 👑",
    description: "See this shiny Enterprise badge? Click it anytime to manage your superstar subscription or tweak your team settings.",
    placement: "bottom",
  },
  {
    targetId: "tour-settings",
    title: "Make It Yours 💅",
    description: "Want to switch to dark mode or tweak your aliases? Head over to Settings and customize the app to your heart's content!",
    placement: "top",
  },
  {
    targetId: "tour-help-button",
    title: "We're Here for You 💬",
    description: "Got a question about integrations, feeling a little stuck, or just want to chat with a real human? Grab this floating button! Our customer service team is always on standby because we truly care about your experience.",
    placement: "left",
  },
];

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  startTour: () => void;
  nextStep: () => void;
  closeTour: () => void;
  currentStep: TourStep | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsTourActive(true);
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      closeTour();
    }
  };

  const closeTour = () => {
    setIsTourActive(false);
    setCurrentStepIndex(0);
  };

  const currentStep = isTourActive ? TOUR_STEPS[currentStepIndex] : null;

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        startTour,
        nextStep,
        closeTour,
        currentStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
