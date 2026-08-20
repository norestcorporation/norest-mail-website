"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, ArchiveX, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { SecondaryActionBar } from "../components/SecondaryActionBar";
import { useCompose } from "../context/ComposeContext";
import { useMessages } from "../hooks/useMessages";
import { useMail } from "../context/MailContext";

export default function ArchivePage() {
  const { folders, apiError } = useMail();
  const archiveFolder = folders.find(f => f.key === 'archive');
  const archiveId = archiveFolder?.id ?? undefined;
  const totalMessages = archiveFolder?.totalCount || 0;

  const { messages, isLoading, deleteMessages, markAsRead, archiveMessages, unarchiveMessages, refreshMessages, toggleStarMessage, restoreMessages, markAsUnread } = useMessages('archive', archiveId);
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

  const handleBulkUnarchive = () => {
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

  const handleBulkArchive = () => { };

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
        totalMessages={typeof totalMessages !== 'undefined' ? totalMessages : messages.length}
        isLoading={isLoading}
        folderType="archive"
        onToggleAll={handleToggleAll}
        onArchive={typeof handleBulkArchive !== 'undefined' ? handleBulkArchive : () => { }}
        onUnarchive={typeof handleBulkUnarchive !== 'undefined' ? handleBulkUnarchive : () => { }}
        onDelete={typeof handleBulkTrash !== 'undefined' ? handleBulkTrash : () => { }}
        onRestore={typeof handleBulkRestore !== 'undefined' ? handleBulkRestore : () => { }}
        onToggleRead={typeof handleMailOpenToggle !== 'undefined' ? handleMailOpenToggle : () => { }}
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
                onUnarchive={(id) => {
                  const inboxFolder = folders.find(f => f.key === 'inbox');
                  const inboxId = inboxFolder?.id;
                  if (inboxId) {
                    unarchiveMessages([id], inboxId);
                  } else {
                    console.error('No inbox ID found for unarchive');
                  }
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
