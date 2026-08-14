"use client";

import { useState } from "react";
import { MessageList } from "../components/MessageList";
import { MessageViewer } from "../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check } from "lucide-react";
import { Header } from "../components/Header";
import clsx from "clsx";
import { useMail } from "../context/MailContext";

export default function ScheduledPage() {
  const { scheduled = [], deleteEmail, toggleReadStatus } = useMail();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

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
              {checkedIds.size > 0 && checkedIds.size < transformedScheduled.length && (
                <div className="w-[7px] h-[2px] bg-white rounded-full" />
              )}
              {checkedIds.size > 0 && checkedIds.size === transformedScheduled.length && (
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
          {checkedIds.size > 0 ? `${checkedIds.size} selected` : `0 of ${transformedScheduled.length}`}
        </div>
      </div>

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
