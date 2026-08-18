"use client";

import { useState, useEffect } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Filter, Archive, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { useMail } from "../context/MailContext";
import { useTour } from "../context/TourContext";
import { useMessages } from "../hooks/useMessages";

export default function InboxPage() {
  const { folders, apiError } = useMail();
  const { startTour } = useTour();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Get the inbox folder to access total count and ID
  const inboxFolder = folders.find(f => f.key === 'inbox');
  const totalMessages = inboxFolder?.totalCount || 0;
  const inboxId = inboxFolder?.id ?? undefined;

  const { messages, isLoading, deleteMessages, markAsRead, archiveMessages, refreshMessages } = useMessages('inbox', inboxId);

  useEffect(() => {
    const WELCOME_KEY = 'norest_welcome_dismissed_at';
    const dismissed = localStorage.getItem(WELCOME_KEY);
    if (dismissed) {
      const elapsed = Date.now() - Number(dismissed);
      // 10 minutes = 600_000 ms
      if (elapsed < 600_000) return; // still within cooldown, stay hidden
    }
    setShowWelcomeModal(true);
  }, []);

  const dismissWelcome = () => {
    localStorage.setItem('norest_welcome_dismissed_at', String(Date.now()));
    setShowWelcomeModal(false);
  };
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const handleToggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const handleToggleAll = () => {
    if (checkedIds.size === messages.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(messages.map((e: any) => e.id)));
    }
  };

  const selectedEmail = messages.find(e => e.id === selectedEmailId) || null;

  const handleDelete = (id: string) => {
    deleteMessages([id]);
    if (selectedEmailId === id) setSelectedEmailId(null);
  };

  const handleBulkTrash = () => {
    if (checkedIds.size > 0) {
      deleteMessages(Array.from(checkedIds));
      setCheckedIds(new Set());
    }
  };

  const handleBulkArchive = () => {
    if (checkedIds.size > 0) {
      archiveMessages(Array.from(checkedIds));
      setCheckedIds(new Set());
    }
  };

  const handleMailOpenToggle = () => {
    if (checkedIds.size > 0) {
      markAsRead(Array.from(checkedIds));
      setCheckedIds(new Set());
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen w-full bg-bg-main overflow-hidden">
      <Header />

      {/* Secondary Action Bar */}
      <div className="h-[48px] border-b border-border-divider bg-bg-surface flex items-center px-4 justify-between shrink-0 transition-colors z-10 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10">
            <div
              onClick={handleToggleAll}
              className={clsx(
                "w-[15px] h-[15px] rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors",
                checkedIds.size > 0 ? "bg-blue-600 border-blue-600" : "bg-transparent border-border-divider dark:border-white/20"
              )}
            >
              {checkedIds.size > 0 && checkedIds.size < messages.length && (
                <div className="w-[7px] h-[2px] bg-white rounded-full" />
              )}
              {checkedIds.size > 0 && checkedIds.size === messages.length && (
                <Check size={10} className="text-white" strokeWidth={4} />
              )}
            </div>
          </div>

          <div className={clsx("flex items-center gap-1 transition-opacity duration-200", checkedIds.size > 0 ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none")}>
            <button onClick={handleBulkArchive} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <Archive size={16} />
            </button>
            <button onClick={handleBulkTrash} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors cursor-pointer">
              <Trash2 size={16} />
            </button>
            <button onClick={handleMailOpenToggle} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <MailOpen size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
        <div className="text-[13px] text-text-secondary font-medium">
          {checkedIds.size > 0 ? `${checkedIds.size} selected` : (
            isLoading ? 'Loading...' : (
              messages.length > 0 ? `1-${messages.length} of ${totalMessages}` : 'No messages'
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <MessageList
          emails={messages}
          isLoading={isLoading}
          apiError={apiError}
          selectedId={selectedEmailId}
          onSelect={(id) => {
            setSelectedEmailId(id);
            // Auto-mark as read when opening
            const email = messages.find((e: any) => e.id === id);
            if (email?.isUnread) markAsRead([id]);
          }}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
          onDelete={handleDelete}
          onMarkAsRead={(id) => markAsRead([id])}
          onRefresh={refreshMessages}
        />
        <AnimatePresence>
          {selectedEmailId && (
            <motion.div
              key="message-viewer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-0 right-0 bottom-0 w-[calc(100%-380px)] z-20 shadow-2xl border-l border-border-divider overflow-hidden"
            >
              <MessageViewer emailId={selectedEmailId} onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simple Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div key="welcome-modal" className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={dismissWelcome}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[420px] bg-white dark:bg-[#000] rounded-[24px] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden font-sans p-8 text-center"
            >
              {/* Top Icon */}
              <div className="mx-auto w-16 h-16 bg-transparent rounded-full flex items-center justify-center mb-6">
                <img
                  src="/logo/logo-01.png"
                  alt="Norest Mail Logo"
                  className="w-10 h-auto object-contain invert dark:invert-0"
                />
              </div>

              <h2 className="text-text-primary text-[28px] font-medium leading-tight mb-4 tracking-tight">
                Welcome, Ripun!<br />
                Your inbox is ready.
              </h2>
              <p className="text-[15px] text-text-secondary font-medium leading-relaxed mb-8 px-2">
                Send and receive email with a clean, private, and fast experience.
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={dismissWelcome}
                  className="cursor-pointer w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 py-3.5 rounded-full font-semibold text-[15px] transition-colors"
                >
                  Compose Email
                </button>
                <button
                  onClick={() => {
                    dismissWelcome();
                    setTimeout(() => startTour(), 300); // slight delay to let modal close
                  }}
                  className="cursor-pointer w-full bg-black/5 dark:bg-white/5 text-text-primary hover:bg-black/10 dark:hover:bg-white/10 py-3.5 rounded-full font-medium text-[15px] transition-colors"
                >
                  Take a Quick Tour
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
