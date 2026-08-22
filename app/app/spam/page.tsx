
"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { SecondaryActionBar } from "../components/SecondaryActionBar";
import { useCompose } from "../context/ComposeContext";
import { useMessages } from "../hooks/useMessages";
import { useMail } from "../context/MailContext";
import { useSyncMessageUrl } from "@/lib/hooks/useSyncMessageUrl";

export default function SpamPage() {
  const { folders, apiError } = useMail();
  const spamFolder = folders.find(f => f.key === 'spam');
  const spamId = spamFolder?.id || undefined;

  const { messages, isLoading, deleteMessages, markAsRead, archiveMessages, refreshMessages, toggleStarMessage, restoreMessages, markAsUnread } = useMessages('spam', spamId);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  useSyncMessageUrl(selectedEmailId, setSelectedEmailId);
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

  const handleBulkRestore = () => {
    if (checkedIds.size > 0 && typeof restoreMessages !== 'undefined') {
      restoreMessages(Array.from(checkedIds));
      setCheckedIds(new Set());
    }
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

  const handleMailOpenToggle = (ids: string[], markRead: boolean) => {
    if (ids.length > 0) {
      if (markRead) {
        if (typeof markAsRead !== 'undefined') markAsRead(ids);
      } else {
        if (typeof markAsUnread !== 'undefined') markAsUnread(ids);
      }
      setCheckedIds(new Set());
    }
  };


  const { openCompose } = useCompose();

  const handleReply = (email: any) => {
    openCompose("reply", {
      messageId: email.id,
      to: email.senderEmail,
      subject: email.subject,
      body: email.preview,
      date: email.date
    });
  };

  const handleToggleStar = (ids: string[], isStarred: boolean) => {
    ids.forEach(id => toggleStarMessage(id, isStarred));
  };

  return (
    <div className="flex flex-col flex-1 h-screen w-full bg-bg-main overflow-hidden">
      <Header />

      <SecondaryActionBar
        messages={messages}
        checkedIds={checkedIds}
        totalMessages={messages.length}
        isLoading={isLoading}
        folderType="spam"
        onToggleAll={handleToggleAll}
        onArchive={handleBulkArchive}
        onUnarchive={() => { }}
        onDelete={handleBulkTrash}
        onRestore={handleBulkRestore}
        onToggleRead={handleMailOpenToggle}
        onToggleStar={handleToggleStar}
        onReply={handleReply}
      />

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
          folder="spam"
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
              <MessageViewer emailId={selectedEmailId} folder="spam" onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
