"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { MessageList } from "../../components/MessageList";
import { MessageViewer } from "../../components/MessageViewer";
import { AnimatePresence, motion } from "framer-motion";
import { Archive, Trash2, MailOpen, MoreHorizontal, Check, Tag } from "lucide-react";
import { Header } from "../../components/Header";
import clsx from "clsx";
import { useMail } from "../../context/MailContext";
import { SecondaryActionBar } from "../../components/SecondaryActionBar";
import { useCompose } from "../../context/ComposeContext";
import { useMessages } from "../../hooks/useMessages";
import { useSyncMessageUrl } from "@/lib/hooks/useSyncMessageUrl";

export default function LabelPage() {
  const { deleteEmail, toggleReadStatus } = useMail();
  const params = useParams();

  const labelParam = params.label as string;
  const labelName = labelParam ? labelParam.charAt(0).toUpperCase() + labelParam.slice(1) : "";

  // Use mock data for the label page
  const { messages: emails, isLoading, refreshMessages, restoreMessages, markAsUnread, toggleStarMessage } = useMessages('inbox');

  // Filter emails by the current label
  const labelEmails = useMemo(() => {
    return emails.filter((email: any) => {
      if (!email.labels) return false;
      // Case insensitive match
      return email.labels.some((l: string) => l.toLowerCase() === labelParam?.toLowerCase());
    });
  }, [emails, labelParam]);

  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  useSyncMessageUrl(selectedEmailId, setSelectedEmailId);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const handleRefresh = () => {
    refreshMessages();
  };

  const handleToggleCheck = (id: string) => {
    const next = new Set(checkedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedIds(next);
  };

  const handleToggleAll = () => {
    if (checkedIds.size === labelEmails.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(labelEmails.map((e: any) => e.id)));
    }
  };

  const selectedEmail = labelEmails.find((e: any) => e.id === selectedEmailId) || null;

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
        messages={labelEmails}
        checkedIds={checkedIds}
        totalMessages={labelEmails.length}
        isLoading={isLoading}
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
          emails={labelEmails}
          selectedId={selectedEmailId}
          onSelect={(id) => setSelectedEmailId(id)}
          checkedIds={checkedIds}
          onToggleCheck={handleToggleCheck}
          onDelete={handleDelete}
          folder={labelParam}
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
              <MessageViewer email={selectedEmail} folder={labelParam} onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
