"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArchiveX, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { useMessages } from "../hooks/useMessages";
import { useMail } from "../context/MailContext";

export default function ArchivePage() {
  const { folders, apiError } = useMail();
  const archiveFolder = folders.find(f => f.key === 'archive');
  const archiveId = archiveFolder?.id ?? undefined;

  const { messages, isLoading, deleteMessages, markAsRead, archiveMessages, unarchiveMessages, refreshMessages, toggleStarMessage } = useMessages('archive', archiveId);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
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

  const selectedEmail = messages.find((e: any) => e.id === selectedEmailId) || null;

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
      // In archive folder, this should unarchive instead
      const inboxFolder = folders.find(f => f.key === 'inbox');
      const inboxId = inboxFolder?.id;
      console.log('Bulk unarchive - inboxFolder:', inboxFolder, 'inboxId:', inboxId);
      if (inboxId) {
        unarchiveMessages(Array.from(checkedIds), inboxId);
      } else {
        console.error('No inbox ID found for bulk unarchive');
      }
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
      <div className="h-[48px] border-b border-border-divider bg-bg-surface flex items-center px-4 justify-between shrink-0 transition-colors z-20 relative">
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
            <button onClick={handleBulkArchive} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Unarchive">
              <ArchiveX size={16} />
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
          {checkedIds.size > 0 ? `${checkedIds.size} selected` : `0 of ${messages.length}`}
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
            // Use the API state for read check
            const email = messages.find((e: any) => e.id === id);
            if (email && (email.is_read === false || email.isUnread === true)) {
              markAsRead([id]);
            }
          }}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
          onDelete={handleDelete}
          onMarkAsRead={(id) => markAsRead([id])}
          folder="archive"
          onRefresh={refreshMessages}
          onToggleStar={toggleStarMessage}
        />
        <AnimatePresence>
          {selectedEmailId && (
            <motion.div
              key="message-viewer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 bottom-0 w-[calc(100%-380px)] z-20 shadow-2xl border-l border-border-divider overflow-hidden"
            >
              <MessageViewer
                emailId={selectedEmailId}
                folder="archive"
                onClose={() => setSelectedEmailId(null)}
                onDelete={(id) => {
                  deleteMessages([id]);
                  setSelectedEmailId(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
