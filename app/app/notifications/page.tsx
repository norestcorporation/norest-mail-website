"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check, Bell } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { useMail } from "../context/MailContext";

export default function NotificationsPage() {
  const { notifications, deleteEmail, toggleReadStatus } = useMail();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Builds", "Security", "Payments", "Account", "Teams"];

  // Transform API data to expected format
  const transformedNotifications = (notifications || []).map((email: any) => ({
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
              {checkedIds.size > 0 && checkedIds.size < transformedNotifications.length && (
                <div className="w-[7px] h-[2px] bg-white rounded-full" />
              )}
              {checkedIds.size > 0 && checkedIds.size === transformedNotifications.length && (
                <Check size={10} className="text-white" strokeWidth={4} />
              )}
            </div>
          </div>

          <div className={clsx("flex items-center gap-1 transition-opacity duration-200", checkedIds.size > 0 ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none")}>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <Archive size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors cursor-pointer">
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
          {checkedIds.size > 0 ? `${checkedIds.size} selected` : `0 of ${transformedNotifications.length}`}
        </div>
      </div>

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
