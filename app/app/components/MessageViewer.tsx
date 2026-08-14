"use client";

import { Reply, Forward, Smile, MoreHorizontal, MessageSquare, Tag, Star, Settings, ChevronDown, X, BadgeCheck, ReplyAll, Edit2, Paperclip, Image as ImageIcon, AlertTriangle, Send, RefreshCw, Trash2, CheckCircle2, Clock, CheckCheck, Eye, Loader2 } from "lucide-react";
import { Email } from "../data/mockData";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useCompose } from "../context/ComposeContext";
import { FileViewerModal, Attachment } from "./FileViewerModal";
import { TranscriptDownloader } from "./TranscriptDownloader";

export function MessageViewer({ email: initialEmail, emailId, folder = 'inbox', onClose, onRead }: { email?: Email | null; emailId?: string; folder?: string; onClose?: () => void; onRead?: () => void }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewerFile, setViewerFile] = useState<Attachment | null>(null);
  const { openCompose } = useCompose();

  const [apiEmail, setApiEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadMessage() {
      if (!emailId) return;
      setIsLoading(true);
      try {
        // Mock implementation - use initialEmail if provided
        if (initialEmail) {
          setApiEmail(initialEmail);
          
          // Mark as read in background (mock)
          if (initialEmail.isUnread && onRead) {
            onRead();
          }
        } else {
          console.warn("No initial email data provided for emailId:", emailId);
        }
      } catch (err) {
        console.error("Failed to load message:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessage();
  }, [emailId, initialEmail, onRead]);

  const email = apiEmail || initialEmail;

  const fullThreadBody = email?.thread
    ? email.thread.map(t => `<p>On ${t.date} ${t.senderName} wrote:</p><blockquote>${t.body}</blockquote>`).join('<br>')
    : email?.body;

  useEffect(() => {
    if (email?.thread && email.thread.length > 0) {
      setExpandedIds(new Set([email.thread[email.thread.length - 1].id]));
    } else {
      setExpandedIds(new Set());
    }
  }, [email?.id]);

  const toggleThread = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };
  if (isLoading && !email) {
    return (
      <div className="flex-1 h-full bg-bg-panel flex items-center justify-center z-10 relative">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  if (!email) {
    return null;
  }

  return (
    <div className="flex-1 h-full bg-bg-panel flex flex-col z-10 relative">



      <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-black dark:text-white hover:text-text-primary transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        {/* Contextual Banners */}
        {folder === 'spam' && (
          <div className="mb-6 p-4 mt-16 rounded-none bg-blue-700 dark:bg-blue-700 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <AlertTriangle className="text-white dark:text-white shrink-0 mt-0.5" size={18} />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-white dark:text-white">Potential spam.</span>
              <span className="text-[13px] text-white dark:text-white mt-0.5">Be careful with links and attachments. Messages in Spam are automatically deleted after 30 days.</span>
            </div>
          </div>
        )}
        {folder === 'trash' && (
          <div className="mb-6 p-4 mt-16 rounded-none bg-blue-700 dark:bg-blue-700 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
            <Trash2 className="text-white dark:text-white shrink-0 mt-0.5" size={18} />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-white dark:text-white">Deleted Message</span>
              <span className="text-[13px] text-white dark:text-white mt-0.5">Deleted emails are permanently removed after 30 days. {email.deletionDate && `Deleted on ${new Date(email.deletionDate).toLocaleDateString()}`}</span>
            </div>
          </div>
        )}

        {/* Subject Header & Download */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pr-16">
          <h1 className="text-2xl font-semibold text-text-primary">{email.subject}</h1>
          <TranscriptDownloader email={email} />
        </div>

        {/* Sender Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[14px] font-medium text-text-secondary">
              {email.senderName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[14.5px] text-text-primary">{email.senderName}</span>
                {email.isOfficial && <BadgeCheck size={16} className="text-blue-500 [&>*:first-child]:fill-blue-500 [&>*:last-child]:stroke-white shrink-0 mr-1" />}
                <span className="text-[13px] text-text-secondary">&lt;{email.senderEmail}&gt;</span>
              </div>
              <div className="text-[13px] text-text-secondary mt-0.5">
                To: {email.recipientEmail}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-secondary mr-1">{email.date} ago</span>
            <button onClick={() => openCompose("reply")} className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
              <Reply size={16} />
            </button>
            <button className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Thread Messages */}
        {email.thread && [...email.thread].reverse().map((msg, index) => {
          const isExpanded = expandedIds.has(msg.id);
          const isLatest = index === 0;

          return (
            <div key={msg.id} className="relative">
              {/* Thread Message Container */}
              <div
                onClick={() => toggleThread(msg.id)}
                className={clsx(
                  "bg-bg-surface rounded-2xl relative z-10 cursor-pointer transition-all",
                  isLatest ? "border border-border-divider hover:border-border-divider/80" : "border border-transparent",
                  isExpanded ? "p-6 md:p-8" : "p-3 md:px-6 md:py-4 flex items-center justify-between"
                )}
              >
                {isExpanded ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[12.5px] font-semibold text-text-secondary">
                          {msg.senderName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[13.5px] text-text-primary">{msg.senderName}</span>
                          <span className="text-[12px] text-text-secondary">{msg.senderEmail}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[12px] text-text-secondary whitespace-nowrap">Date: Mon, {msg.date} 2026 {msg.timestamp} +0530</span>
                      </div>
                    </div>
                    <div className="text-[14px] leading-[1.6] text-text-primary whitespace-pre-wrap md:pl-11">
                      {msg.body}
                    </div>
                    {/* Attachments Section */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-4 md:pl-11">
                        <div className="flex flex-wrap gap-4">
                          {msg.attachments.map((file, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                              {file.type === 'image' ? (
                                <div onClick={(e) => { e.stopPropagation(); setViewerFile(file as Attachment); }} className="w-48 h-32 rounded-lg overflow-hidden border border-black/5 dark:border-white/10 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                </div>
                              ) : null}
                              <div onClick={(e) => { e.stopPropagation(); setViewerFile(file as Attachment); }} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/10 shadow-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors max-w-[192px]">
                                {file.type === 'image' || file.name.endsWith('.png') || file.name.endsWith('.jpg') ? (
                                  <ImageIcon size={14} className="text-blue-500 shrink-0" />
                                ) : (
                                  <Paperclip size={14} className="text-orange-500 shrink-0" />
                                )}
                                <span className="text-[13px] text-gray-700 dark:text-gray-200 truncate">{file.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Thread Actions Footer */}
                    <div className="flex flex-wrap items-center gap-2 mt-6 md:pl-11" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => { e.stopPropagation(); openCompose("reply", { to: msg.senderEmail, subject: email.subject, body: msg.body, attachments: msg.attachments, senderName: msg.senderName, date: msg.date }); }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Reply size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Reply</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openCompose("replyAll", { to: msg.senderEmail, subject: email.subject, body: fullThreadBody }); }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <ReplyAll size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Reply all</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openCompose("forward", { subject: email.subject, body: msg.body, attachments: msg.attachments }); }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Forward size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Forward</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openCompose("editAsNew", { subject: email.subject, body: msg.body, attachments: msg.attachments }); }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Edit2 size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Edit as new</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[12.5px] font-semibold text-text-secondary">
                        {msg.senderName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[13.5px] text-text-primary shrink-0">{msg.senderName}</span>
                      <span className="text-[13px] text-text-secondary truncate">{msg.body.split('\n')[0]}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-[12px] text-text-secondary">{msg.timestamp}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Thread Line connecting to the older message below */}
              <div className="w-[2px] h-8 bg-border-divider ml-[38px] my-0 z-0 relative"></div>
            </div>
          );
        })}

        {/* Inner Message Container (Original Oldest Message) */}
        <div className={clsx("bg-bg-surface rounded-2xl p-6 md:p-8 relative", (!email.thread || email.thread.length === 0) ? "border border-border-divider" : "border border-transparent")}>
          <div className="text-[14.5px] leading-[1.6] text-text-primary whitespace-pre-wrap">
            {email.body}
          </div>

          {/* Quick Actions Footer */}
          {folder !== 'drafts' && folder !== 'scheduled' && (
            <div className="flex items-center gap-2 mt-8">
              <button onClick={() => openCompose("reply", { to: email.senderEmail, subject: email.subject, body: email.body, date: email.date, senderName: email.senderName })} className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Reply size={14} className="text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Reply</span>
              </button>
              <button onClick={() => openCompose("forward", { subject: email.subject, body: email.body })} className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Forward size={14} className="text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Forward</span>
              </button>
              <button className="cursor-pointer w-9 h-9 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Smile size={16} className="text-text-secondary" />
              </button>
            </div>
          )}
        </div>

        {/* Final Thread Line connecting to the reply actions */}
        <div className="w-[2px] h-8 bg-border-divider ml-[38px] my-0 z-0 relative"></div>

        {/* Extra Card for Sent items */}
        {folder === 'sent' && (
          <div className="mt-8 p-6 bg-bg-surface border border-border-divider rounded-2xl">
            <h3 className="text-[14px] font-semibold text-text-primary mb-4 flex items-center gap-2"><Send size={16} className="text-text-secondary" /> Delivery Tracking</h3>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[13px] text-text-primary font-medium">Sent</span>
              </div>
              <div className="w-8 h-[1px] bg-border-divider"></div>
              <div className="flex items-center gap-2">
                <CheckCheck size={16} className="text-blue-500" />
                <span className="text-[13px] text-text-primary font-medium">Delivered</span>
              </div>
              <div className="w-8 h-[1px] bg-border-divider"></div>
              <div className="flex items-center gap-2">
                <Eye size={16} className={clsx(email.deliveryStatus === 'Opened' ? "text-purple-500" : "text-text-tertiary")} />
                <span className={clsx("text-[13px] font-medium", email.deliveryStatus === 'Opened' ? "text-text-primary" : "text-text-tertiary")}>Opened</span>
              </div>
            </div>
          </div>
        )}

        {/* Final Actions */}
        <div className="flex items-center gap-3 z-10 relative mt-8">
          {folder === 'drafts' ? (
            <>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-blue-600 border border-blue-500 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                <Edit2 size={15} className="text-white" />
                <span className="text-[14px] font-semibold text-white">Continue Editing</span>
              </button>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
                <Send size={15} className="text-text-primary" />
                <span className="text-[14px] font-semibold text-text-primary">Send Now</span>
              </button>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
                <Trash2 size={15} className="text-red-500" />
                <span className="text-[14px] font-semibold text-red-500">Delete Draft</span>
              </button>
            </>
          ) : folder === 'scheduled' ? (
            <>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-blue-600 border border-blue-500 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                <Send size={15} className="text-white" />
                <span className="text-[14px] font-semibold text-white">Send Now</span>
              </button>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
                <Clock size={15} className="text-text-primary" />
                <span className="text-[14px] font-semibold text-text-primary">Edit Time</span>
              </button>
              <button className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
                <X size={15} className="text-red-500" />
                <span className="text-[14px] font-semibold text-red-500">Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => openCompose("reply", { to: email.senderEmail, subject: email.subject, body: email.body, date: email.date, senderName: email.senderName })} className="cursor-pointer h-10 px-6 rounded-full bg-blue-600 border border-blue-500 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                <Reply size={15} className="text-white" />
                <span className="text-[14px] font-semibold text-white">Reply</span>
              </button>
              <button onClick={() => openCompose("forward", { subject: email.subject, body: email.body })} className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
                <Forward size={15} className="text-text-primary" />
                <span className="text-[14px] font-semibold text-text-primary">Forward</span>
              </button>
            </>
          )}
        </div>

      </div>

      <FileViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />
    </div>
  );
}
