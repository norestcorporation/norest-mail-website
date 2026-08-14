"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ComposeModal } from "../components/ComposeModal";

type ComposeAction = "new" | "reply" | "replyAll" | "forward" | "editAsNew" | "draft";

type ComposeContextType = {
  openCompose: (action?: ComposeAction, initialData?: any) => void;
  closeCompose: () => void;
};

const ComposeContext = createContext<ComposeContextType | undefined>(undefined);

export function ComposeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<ComposeAction>("new");
  const [initialData, setInitialData] = useState<any>(null);

  const openCompose = (newAction: ComposeAction = "new", data?: any) => {
    setAction(newAction);
    setInitialData(data || null);
    setIsOpen(true);
  };

  const closeCompose = () => setIsOpen(false);

  return (
    <ComposeContext.Provider value={{ openCompose, closeCompose }}>
      {children}
      <ComposeModal isOpen={isOpen} onClose={closeCompose} action={action} initialData={initialData} />
    </ComposeContext.Provider>
  );
}

export function useCompose() {
  const context = useContext(ComposeContext);
  if (context === undefined) {
    throw new Error("useCompose must be used within a ComposeProvider");
  }
  return context;
}
