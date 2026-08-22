"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import { SecondaryActionBar } from "../components/SecondaryActionBar";
import clsx from "clsx";
import { useMail } from "../context/MailContext";
import { useSyncMessageUrl } from "@/lib/hooks/useSyncMessageUrl";

export default function ScheduledPage() {
  const { scheduled = [], deleteEmail, toggleReadStatus, refreshFolders } = useMail();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  useSyncMessageUrl(selectedEmailId, setSelectedEmailId);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());

  const handleRefresh = () => {
    refreshFolders();
  };

  // Transform API data to expected format
  const transformedScheduled = (scheduled || []).map((email: any) => ({
    id: email.id,
    subject: email.subject,
    senderName: email.from?.[0]?.name || email.from?.[0]?.email || 'Unknown',
    date: new Date(email.receivedAt).toLocaleDateString(),
    isUnread: !email.keywords?.$seen,
    preview: email.preview
  }));

  const handleToggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const handleToggleAll = () => {
    if (checkedIds.size === transformedScheduled.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(transformedScheduled.map((e: any) => e.id)));
    }
  };

  const selectedEmailIdForViewer = selectedEmailId;

  const handleDelete = (id: string) => {
    deleteEmail(id);
    if (selectedEmailId === id) setSelectedEmailId(null);
  };

  const handleMailOpenToggle = () => {
    if (checkedIds.size > 0) {
      checkedIds.forEach((id: string) => toggleReadStatus(id));
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
        messages={transformedScheduled}
        checkedIds={checkedIds}
        totalMessages={transformedScheduled.length}
        isLoading={false}
        folderType="inbox"
        onToggleAll={handleToggleAll}
        onArchive={() => { }}
        onUnarchive={() => { }}
        onDelete={() => { }}
        onRestore={() => { }}
        onToggleRead={handleMailOpenToggle}
        onToggleStar={handleToggleStar}
        onReply={handleReply}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <MessageList
          emails={transformedScheduled}
          selectedId={selectedEmailId}
          onSelect={(id) => setSelectedEmailId(id)}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
          onDelete={handleDelete}
          folder="scheduled"
          onRefresh={handleRefresh}
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
              <MessageViewer emailId={selectedEmailIdForViewer || undefined} folder="scheduled" onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
