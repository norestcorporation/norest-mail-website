"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { useMail } from "../context/MailContext";
import { Mail, Newspaper, BellOff, Archive, CheckCircle2, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { MessageViewer } from "../components/MessageViewer";

export default function NewsletterPage() {
  const { newsletters = [], toggleReadStatus } = useMail();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Transform API data to expected format
  const transformedNewsletters = (newsletters || []).map((email: any) => ({
    id: email.id,
    subject: email.subject,
    senderName: email.from?.[0]?.name || email.from?.[0]?.email || 'Unknown',
    date: new Date(email.receivedAt).toLocaleDateString(),
    isUnread: !email.keywords?.$seen,
    preview: email.preview
  }));

  // Group newsletters by sender
  const groupedNewsletters = (transformedNewsletters || []).reduce((acc: any, email: any) => {
    if (!acc[email.senderName]) {
      acc[email.senderName] = [];
    }
    acc[email.senderName].push(email);
    return acc;
  }, {} as Record<string, any[]>);

  const selectedEmailIdForViewer = selectedEmailId;

  return (
    <div className="flex flex-col flex-1 h-screen w-full bg-bg-main overflow-hidden">
      <Header />

      {/* Top Summary */}
      <div className="border-b border-border-divider bg-bg-surface px-8 pt-8 pb-6 shrink-0 relative z-20">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper size={24} className="text-text-primary" />
          <h1 className="text-2xl font-bold text-text-primary">Newsletters</h1>
        </div>

        <div className="flex items-center gap-8 mb-8">
          <div className="flex flex-col">
            <span className="text-[24px] font-bold text-text-primary">{Object.keys(groupedNewsletters).length}</span>
            <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">Subscriptions</span>
          </div>
          <div className="w-[1px] h-8 bg-border-divider"></div>
          <div className="flex flex-col">
            <span className="text-[24px] font-bold text-black dark:text-white">{transformedNewsletters.filter((n: any) => n.isUnread).length}</span>
            <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">Unread</span>
          </div>
          <div className="w-[1px] h-8 bg-border-divider"></div>
          <div className="flex flex-col">
            <span className="text-[24px] font-bold text-text-primary">Today</span>
            <span className="text-[12px] text-text-secondary uppercase tracking-wider font-semibold">Last Received</span>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <Archive size={14} className="text-text-primary" />
            <span className="text-[13px] font-semibold text-text-primary">Archive All</span>
          </button>
          <button className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <CheckCircle2 size={14} className="text-text-primary" />
            <span className="text-[13px] font-semibold text-text-primary">Mark Read</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <div className={clsx("flex-1 overflow-y-auto p-8 transition-all duration-300", selectedEmailId ? "pr-[400px]" : "")}>
          <div className="max-w-4xl mx-auto space-y-12">
            {Object.entries(groupedNewsletters).map(([sender, emails]: [string, any]) => {
              const typedEmails = emails as any[];
              return (
                <div key={sender} className="bg-bg-surface border border-border-divider rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-divider">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg-surface-active flex items-center justify-center font-bold text-text-primary text-[15px]">
                        {sender.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-[16px] font-bold text-text-primary">{sender}</h2>
                        <span className="text-[13px] text-text-secondary">{typedEmails.length} newsletters</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary cursor-pointer" title="Mute Sender">
                        <BellOff size={16} />
                      </button>
                      <button className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 cursor-pointer" title="Unsubscribe">
                        <Mail size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {typedEmails.map((email: any) => (
                      <div
                        key={email.id}
                        onClick={() => setSelectedEmailId(email.id)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={clsx("w-2 h-2 rounded-full shrink-0", email.isUnread ? "bg-blue-500" : "bg-transparent")} />
                          <span className={clsx("text-[14px] truncate", email.isUnread ? "text-text-primary font-bold" : "text-text-primary font-medium")}>{email.subject}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 pl-4">
                          <span className="text-[12px] text-text-secondary">{email.date}</span>
                          <MoreHorizontal size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {Object.keys(groupedNewsletters).length === 0 && (
              <div className="text-center py-20">
                <Newspaper size={48} className="mx-auto text-border-divider mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No newsletters</h3>
                <p className="text-text-secondary">You haven't received any newsletters yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Viewer Slide-in */}
        <AnimatePresence>
          {selectedEmailId && (
            <motion.div
              key="newsletter-viewer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 bottom-0 w-[400px] z-30 shadow-2xl border-l border-border-divider bg-bg-main overflow-hidden"
            >
              <MessageViewer emailId={selectedEmailIdForViewer || undefined} folder="newsletter" onClose={() => setSelectedEmailId(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
