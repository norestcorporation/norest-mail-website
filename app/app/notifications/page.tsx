"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check, Bell } from "lucide-react";
import { Header } from "../components/Header";
import { SecondaryActionBar } from "../components/SecondaryActionBar";
import clsx from "clsx";
import { useMail } from "../context/MailContext";
import { useSyncMessageUrl } from "@/lib/hooks/useSyncMessageUrl";

import { useCompose } from "../context/ComposeContext";

export default function NotificationsPage() {
  const { notifications, deleteEmail, toggleReadStatus, refreshFolders } = useMail();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  useSyncMessageUrl(selectedEmailId, setSelectedEmailId);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");

  const handleRefresh = () => {
    refreshFolders();
  };

  const filters = ["All", "Builds", "Security", "Payments", "Account", "Teams"];

  // Transform API data to expected format
  const transformedNotifications = (notifications || []).map((email: any) => ({
    id: email.id,
    subject: email.subject,
    senderName: email.from?.[0]?.name || email.from?.[0]?.email || 'Unknown',
    date: new Date(email.receivedAt).toLocaleDateString(),
    isUnread: !email.keywords?.$seen,
    preview: email.preview,
    // Add extra properties to satisfy ApiMessage type
    threadId: email.threadId || email.id,
    from: email.from || [],
    to: email.to || [],
    receivedAt: email.receivedAt || new Date().toISOString(),
    isStarred: email.keywords?.$flagged || false,
    hasAttachment: false
  }));

  const handleToggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const handleToggleAll = () => {
    if (checkedIds.size === transformedNotifications.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(transformedNotifications.map((e: any) => e.id)));
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
      to: email.senderEmail || email.from?.[0]?.email,
      subject: email.subject,
      body: email.preview,
      date: email.date
    });
  };

  const handleToggleStar = (ids: string[], isStarred: boolean) => {
    // dummy implementation
  };

  return (
    <div className="flex flex-col flex-1 h-screen w-full bg-bg-main overflow-hidden">
      <Header />

      {/* Notifications Stats & Filters */}
      <div className="border-b border-border-divider bg-bg-surface px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <Bell size={20} className="text-text-primary" />
          <h1 className="text-2xl font-semibold text-text-primary">Notifications</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-center">
              <span className="block text-[20px] font-bold text-text-primary">{transformedNotifications.filter((n: any) => n.isUnread).length}</span>
              <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">Unread</span>
            </div>
            <div className="w-[1px] h-8 bg-border-divider"></div>
            <div className="text-center">
              <span className="block text-[20px] font-bold text-black dark:text-white">3</span>
              <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">Critical</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={clsx(
                "px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors border",
                activeFilter === f
                  ? "bg-text-primary text-bg-main border-transparent"
                  : "bg-transparent text-text-secondary border-border-divider hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <SecondaryActionBar
        messages={transformedNotifications}
        checkedIds={checkedIds}
        totalMessages={transformedNotifications.length}
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
          emails={transformedNotifications}
          selectedId={selectedEmailId}
          onSelect={(id) => setSelectedEmailId(id)}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
          onDelete={handleDelete}
          folder="notifications"
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
              <MessageViewer emailId={selectedEmailIdForViewer || undefined} folder="notifications" onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
