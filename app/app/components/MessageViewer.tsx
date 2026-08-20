"use client";

import { Reply, Forward, Smile, MoreHorizontal, MessageSquare, Tag, Star, Settings, ChevronDown, X, BadgeCheck, ReplyAll, Edit2, Paperclip, Image as ImageIcon, AlertTriangle, Send, RefreshCw, Trash2, Clock, Loader2, Archive, Sparkles, CurlyBraces } from "lucide-react";
import { Email } from "../data/mockData";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useCompose } from "../context/ComposeContext";
import { FileViewerModal, Attachment } from "./FileViewerModal";
import { TranscriptDownloader } from "./TranscriptDownloader";
import { getMessageDetail, getThreadMessagesApi, MessageDetail, MessageAttachment, toggleReaction, Reaction } from "@/lib/api/message_viewer";
import { EmailContentRenderer } from "./EmailContentRenderer";
import { downloadAttachment } from "@/lib/api/compose";
import EmojiPickerReact, { Theme } from "emoji-picker-react";
import { starMessage, unstarMessage } from "@/lib/api/mail_actions";
import { getAccessToken } from "@/lib/token_manager";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper function to convert API message format to Email format
function convertApiToEmail(message: MessageDetail, currentFolder: string): Email {
  const senderEmail = message.from?.[0]?.email || '';
  const senderName = message.from?.[0]?.name || senderEmail.split('@')[0] || '';
  const recipientEmail = message.to?.[0]?.email || '';
  const recipientName = message.to?.[0]?.name || recipientEmail.split('@')[0] || '';

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return {
    id: message.id,
    senderName: senderName, // Always use actual sender for reply functionality
    senderEmail: senderEmail, // Always use actual sender for reply functionality
    recipientEmail: recipientEmail,
    subject: message.subject || '',
    snippet: message.preview || '',
    body: message.html_body || message.text_body || '',
    date: formatDate(message.received_at || message.sent_at),
    isUnread: !message.is_read,
    isStarred: message.is_starred,
    isOfficial: false,
    hasAttachment: message.has_attachment,
    deliveryStatus: 'Delivered', // Default status
    thread: [], // Would need to fetch thread separately if needed
    labels: [],
    deletionDate: undefined
  };
}

import { ApiMessage } from "../api/mockMailApi";
import { FaCubes } from "react-icons/fa";

const formatSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export function MessageViewer({ email: initialEmail, emailId, folder = 'inbox', onClose, onRead, onArchive, onUnarchive, onDelete }: { email?: Email | ApiMessage | null; emailId?: string; folder?: string; onClose?: () => void; onRead?: () => void; onArchive?: (id: string) => void; onUnarchive?: (id: string) => void; onDelete?: (id: string) => void; }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(false);
  const [viewerFile, setViewerFile] = useState<Attachment | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
  const { openCompose } = useCompose();

  const handleReactionToggle = async (messageId: string, emoji: string) => {
    // Optimistic update
    const updateMsgReactions = (msg: MessageDetail) => {
      const existingReactions = msg.reactions || [];
      const userEmail = "admin@localhost"; // Ideally from auth context, but using admin@localhost for now

      const hasReacted = existingReactions.some(r => r.emoji === emoji && r.user_email === userEmail);

      let newReactions;
      if (hasReacted) {
        newReactions = existingReactions.filter(r => !(r.emoji === emoji && r.user_email === userEmail));
      } else {
        newReactions = [...existingReactions, {
          id: Math.random().toString(),
          message_id: messageId,
          user_email: userEmail,
          emoji,
          created_at: new Date().toISOString()
        }];
      }
      return { ...msg, reactions: newReactions };
    };

    if (apiMessage?.id === messageId) {
      setApiMessage(updateMsgReactions(apiMessage));
    }

    setThreadMessages(prev => prev.map(m => m.id === messageId ? updateMsgReactions(m) : m));

    // Call API
    await toggleReaction(messageId, emoji);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
      setActiveReactionPicker(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [apiMessage, setApiMessage] = useState<MessageDetail | null>(null);
  const [threadMessages, setThreadMessages] = useState<MessageDetail[]>([]);
  const [apiEmail, setApiEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessage() {
      if (!emailId) return;
      setIsLoading(true);
      setError(null);
      try {
        // Fetch real message data from API
        const messageData = await getMessageDetail(emailId);
        if (messageData) {
          setApiMessage(messageData);

          // Fetch thread messages if thread_id is available
          if (messageData.thread_id) {
            const threadData = await getThreadMessagesApi(messageData.thread_id);
            if (threadData) {
              setThreadMessages(threadData);
            }
          }

          // Mark as read callback
          if (onRead) {
            onRead();
          }
        } else {
          // Fallback to initialEmail if API fails
          if (initialEmail) {
            setApiEmail(initialEmail as unknown as Email);
            if ('isUnread' in initialEmail && initialEmail.isUnread && onRead) {
              onRead();
            }
          } else {
            setError("Failed to load message");
          }
        }
      } catch (err) {
        console.error("Failed to load message:", err);
        // Fallback to initialEmail if API fails
        if (initialEmail) {
          setApiEmail(initialEmail as unknown as Email);
          if ('isUnread' in initialEmail && initialEmail.isUnread && onRead) {
            onRead();
          }
        } else {
          setError("Failed to load message");
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadMessage();
  }, [emailId, initialEmail, onRead]);

  const handleAttachmentClick = async (attachment: MessageAttachment) => {
    if (!attachment.blob_id) {
      return;
    }

    try {
      const response = await downloadAttachment(attachment.blob_id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to download attachment");
      }
      let blob = response.data;

      // Ensure the blob has the correct MIME type so the browser will render it
      let mimeType = attachment.type;
      if (!mimeType && attachment.name) {
        const ext = attachment.name.split('.').pop()?.toLowerCase();
        if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'gif') mimeType = 'image/gif';
        else if (ext === 'webp') mimeType = 'image/webp';
        else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
      }

      if (mimeType && blob.type !== mimeType) {
        blob = new Blob([blob], { type: mimeType });
      }

      const url = URL.createObjectURL(blob);
      let fileType: "image" | "video" | "audio" | "pdf" | "text" | "file" = 'file';
      const typeStr = mimeType?.toLowerCase() || '';
      const nameStr = attachment.name?.toLowerCase() || '';

      if (typeStr.startsWith('image/') || nameStr.match(/\.(jpg|jpeg|png|gif|webp|svg|heic)$/)) {
        fileType = 'image';
      } else if (typeStr.startsWith('video/') || nameStr.match(/\.(mp4|webm|mov|mkv)$/)) {
        fileType = 'video';
      } else if (typeStr.startsWith('audio/') || nameStr.match(/\.(mp3|wav|ogg|m4a)$/)) {
        fileType = 'audio';
      } else if (typeStr === 'application/pdf' || nameStr.endsWith('.pdf')) {
        fileType = 'pdf';
      } else if (typeStr.startsWith('text/') || nameStr.match(/\.(txt|csv|md|json|xml|js|ts|html|css|py)$/)) {
        fileType = 'text';
      }

      setViewerFile({
        name: attachment.name || 'Unnamed file',
        url: url,
        type: fileType,
        attachmentId: attachment.blob_id,
        size: attachment.size,
        mimeType: mimeType || 'application/octet-stream',
      } as Attachment);
    } catch (e) {
      console.error("Failed to download attachment", e);
      alert("Failed to load attachment");
    }
  };

  // Convert initialEmail to Email if it is an ApiMessage
  const parsedInitialEmail = initialEmail ? ('isUnread' in initialEmail ? initialEmail as unknown as Email : initialEmail as Email) : null;
  const email = apiMessage ? convertApiToEmail(apiMessage, folder) : apiEmail || parsedInitialEmail;

  // Convert thread messages to Email format for rendering
  const threadEmails = threadMessages.map(msg => convertApiToEmail(msg, folder));

  const fullThreadBody = threadEmails.length > 0
    ? threadEmails.map(t => `<p>On ${t.date} ${t.senderName} wrote:</p><blockquote>${t.body}</blockquote>`).join('<br>')
    : email?.body;

  useEffect(() => {
    if (threadEmails.length > 0) {
      const latestId = threadEmails[threadEmails.length - 1].id;
      setExpandedIds(new Set([latestId]));
    } else {
      setExpandedIds(new Set());
    }
  }, [threadEmails.length]);

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
  if (error && !email) {
    return (
      <div className="flex-1 h-full bg-bg-panel flex items-center justify-center z-10 relative">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-text-primary text-[16px]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (!email) {
    return null;
  }

  const rawHtml = apiMessage ? (apiMessage.html_body || apiMessage.text_body || '') : (email?.body || '');
  let mainHtml = rawHtml;
  let quoteHtml = '';
  const quoteRegex = /(?:<br[^>]*>\s*|<hr[^>]*>\s*)*(?:<blockquote[^>]*class="[^"]*norest-quote[^"]*"[^>]*>|<div[^>]*class="[^"]*gmail_quote[^"]*"[^>]*>|<blockquote[^>]*type="cite"[^>]*>)/i;
  const match = rawHtml.match(quoteRegex);
  if (match && match.index !== undefined) {
    mainHtml = rawHtml.substring(0, match.index);
    quoteHtml = rawHtml.substring(match.index).replace(/^(?:<br[^>]*>\s*|<hr[^>]*>\s*|\n|\r)*/i, '');
  }

  return (
    <div className="flex-1 h-full bg-bg-panel flex flex-col z-10 relative">

      <FileViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />

      <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative">
        {/* Header Actions */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-2 z-20">
          <button
            onClick={() => emailId && onArchive && onArchive(emailId)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            title="Archive"
          >
            <Archive size={16} />
          </button>
          <button
            onClick={() => emailId && onDelete && onDelete(emailId)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary hover:text-red-500 transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('header')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'header' ? null : 'header'); }}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              title="More Options"
            >
              <MoreHorizontal size={16} />
            </button>
            {activeDropdown === 'header' && (
              <div className="absolute right-0 top-full pt-2 z-50">
                <div className="w-64 bg-white dark:bg-[#1A1A1A] border border-border-divider rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden py-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 pb-2 mb-1 border-b border-border-divider">
                    <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider pl-1">Norest AI Assistant</div>
                  </div>
                  <button className="w-full px-3 py-2.5 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-3 cursor-pointer group">
                    <FaCubes size={16} className="text-text-secondary group-hover:text-text-primary transition-colors" fill="currentColor" />
                    <span className="font-medium">Summarize Email</span>
                  </button>
                  <button className="w-full px-3 py-2.5 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-3 cursor-pointer group">
                    <MessageSquare size={16} className="text-text-secondary group-hover:text-text-primary transition-colors" fill="currentColor" />
                    <span className="font-medium">Smart Reply</span>
                  </button>


                  <div className="my-2 border-t border-border-divider"></div>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const currentIsStarred = email?.isStarred;
                      const msgId = emailId || email?.id;
                      if (!msgId) return;

                      // Optimistic UI update
                      if (apiEmail) {
                        setApiEmail({ ...apiEmail, isStarred: !currentIsStarred });
                      } else if (apiMessage) {
                        setApiMessage({ ...apiMessage, is_starred: !currentIsStarred });
                      }

                      // API call
                      const token = getAccessToken();
                      if (token) {
                        if (currentIsStarred) {
                          await unstarMessage(token, msgId);
                        } else {
                          await starMessage(token, msgId);
                        }

                        // Fire event to refresh messages in background
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('mail-sent'));
                        }
                      }
                      setActiveDropdown(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Star size={15} className="text-text-secondary" /> {email?.isStarred ? 'Unstar message' : 'Star message'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (folder === 'archive') {
                        if (emailId && onUnarchive) onUnarchive(emailId);
                      } else {
                        if (emailId && onArchive) onArchive(emailId);
                      }
                      setActiveDropdown(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <Clock size={15} className="text-text-secondary" /> {folder === 'archive' ? 'Unsnooze' : 'Snooze'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-black dark:text-white hover:text-text-primary transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pr-[160px] md:pr-[200px]">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-text-primary">{email.subject}</h1>
            {apiMessage && (
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-text-tertiary">
                <span>Size: {formatSize(apiMessage.size)}</span>
                <TranscriptDownloader email={email} />
                {apiMessage.has_attachment && (
                  <span className="flex items-center gap-1">
                    <Paperclip size={12} />
                    Has attachments
                  </span>
                )}
                {apiMessage.is_draft && (
                  <span className="text-yellow-600">Draft</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sender Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[14px] font-medium text-text-secondary">
              {apiMessage ? (
                folder === 'sent'
                  ? (apiMessage.to?.[0]?.email?.charAt(0)?.toUpperCase() || 'R')
                  : (apiMessage.from?.[0]?.email?.charAt(0)?.toUpperCase() || 'S')
              ) : (
                folder === 'sent' ? email.recipientEmail?.charAt(0)?.toUpperCase() || 'R' : email.senderName.charAt(0)
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[14.5px] text-text-primary">
                  {apiMessage ? (
                    folder === 'sent'
                      ? (apiMessage.to?.[0]?.name || apiMessage.to?.[0]?.email?.split('@')[0] || 'Recipient')
                      : (apiMessage.from?.[0]?.name || apiMessage.from?.[0]?.email?.split('@')[0] || 'Sender')
                  ) : (
                    folder === 'sent' ? (email.recipientEmail?.split('@')[0] || 'Recipient') : email.senderName
                  )}
                </span>
                {email.isOfficial && <BadgeCheck size={16} className="text-blue-500 [&>*:first-child]:fill-blue-500 [&>*:last-child]:stroke-white shrink-0 mr-1" />}
                {threadEmails.length === 0 && (
                  <div title="Latest Message" className="w-1.5 h-1.5 rounded-sm bg-black dark:bg-white opacity-40 hover:opacity-100 transition-opacity cursor-help shrink-0"></div>
                )}
                <span className="text-[13px] text-text-secondary">
                  &lt;{apiMessage ? (
                    folder === 'sent'
                      ? (apiMessage.to?.[0]?.email || '')
                      : (apiMessage.from?.[0]?.email || '')
                  ) : (
                    folder === 'sent' ? (email.recipientEmail || '') : email.senderEmail
                  )}&gt;
                </span>
              </div>
              <div className="text-[13px] text-text-secondary mt-0.5">
                {folder === 'sent' ? `From: ${apiMessage?.from?.[0]?.email || email.senderEmail}` : `To: ${apiMessage?.to?.[0]?.email || email.recipientEmail}`}
              </div>
              {apiMessage && apiMessage.cc && apiMessage.cc.length > 0 && (
                <div className="text-[12px] text-text-tertiary mt-1">
                  Cc: {apiMessage.cc.map(c => c.email).join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[12px] text-text-secondary block">{email.date}</span>
              {apiMessage && (
                <span className="text-[11px] text-text-tertiary block">
                  {new Date(apiMessage.received_at || apiMessage.sent_at).toLocaleString()}
                </span>
              )}
            </div>
            <button onClick={() => openCompose("reply", {
              messageId: apiMessage?.id,
              to: apiMessage?.from?.[0]?.email || email.senderEmail,
              subject: email.subject,
              body: email.body,
              date: email.date,
              senderName: apiMessage?.from?.[0]?.name || email.senderName
            })} className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors" title="Reply">
              <Reply size={16} />
            </button>
            <button onClick={() => openCompose("forward", {
              subject: email.subject,
              body: email.body,
              date: apiMessage?.sent_at || apiMessage?.received_at || email.date,
              senderName: apiMessage?.from?.[0]?.name || email.senderName,
              senderEmail: apiMessage?.from?.[0]?.email || email.senderEmail,
              to: apiMessage?.to?.map((t: any) => t.email).join(', ') || email.recipientEmail,
              from: apiMessage?.from
            })} className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors" title="Forward">
              <Forward size={16} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'main' ? null : 'main'); }}
                className="cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
                title="More Options"
              >
                <MoreHorizontal size={16} />
              </button>
              {activeDropdown === 'main' && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-panel border border-border-divider rounded-lg shadow-lg z-50 overflow-hidden py-1">
                  <button className="w-full px-4 py-2 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-500" /> AI Summarize
                  </button>
                  <button className="w-full px-4 py-2 text-left text-[13px] text-text-primary hover:bg-bg-surface-active transition-colors flex items-center gap-2">
                    <Star size={14} /> {(initialEmail || apiEmail)?.isStarred ? 'Unstar message' : 'Star message'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thread Messages */}
        {threadEmails.length > 0 && [...threadEmails].reverse().map((msg, index) => {
          const isExpanded = expandedIds.has(msg.id);
          const isLatest = index === 0;
          const threadMsgDetail = threadMessages.find(m => m.id === msg.id);

          return (
            <div key={msg.id} className="relative">
              {/* Thread Message Container */}
              <div
                onClick={() => toggleThread(msg.id)}
                className={clsx(
                  "bg-bg-surface rounded-2xl relative z-10 cursor-pointer transition-all border border-border-divider overflow-hidden",
                  isExpanded ? "p-6 md:p-8" : "p-3 md:px-6 md:py-4 flex items-center justify-between hover:bg-bg-surface-hover"
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
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[13.5px] text-text-primary">{msg.senderName}</span>
                            {isLatest && (
                              <div title="Latest Message" className="w-1.5 h-1.5 rounded-sm bg-black dark:bg-white opacity-40 hover:opacity-100 transition-opacity cursor-help shrink-0"></div>
                            )}
                          </div>
                          <span className="text-[12px] text-text-secondary">{msg.senderEmail}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[12px] text-text-secondary whitespace-nowrap">{msg.date}</span>
                      </div>
                    </div>
                    <EmailContentRenderer html={threadMsgDetail ? (threadMsgDetail.html_body || threadMsgDetail.text_body || '') : (msg.body || '')} className="-mx-6 md:-mx-8 mt-4 email-content" />
                    {/* Attachments Section */}
                    {threadMsgDetail?.attachments && threadMsgDetail.attachments.length > 0 && (
                      <div className="mt-4 md:pl-11">
                        <div className="flex flex-wrap gap-4">
                          {threadMsgDetail.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                              {attachment.type?.startsWith('image/') || attachment.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <div onClick={(e) => { e.stopPropagation(); handleAttachmentClick(attachment); }} className="w-48 h-32 rounded-lg overflow-hidden border border-black/5 dark:border-white/10 shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                                  <img src={attachment.blob_id ? `${BASE_URL}/v1/mail/attachments/${attachment.blob_id}` : ''} alt={attachment.name} className="w-full h-full object-cover" />
                                </div>
                              ) : null}
                              <div onClick={(e) => { e.stopPropagation(); handleAttachmentClick(attachment); }} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/10 shadow-sm cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors max-w-[192px]">
                                {attachment.type?.startsWith('image/') || attachment.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                  <ImageIcon size={14} className="text-blue-500 shrink-0" />
                                ) : (
                                  <Paperclip size={14} className="text-orange-500 shrink-0" />
                                )}
                                <span className="text-[13px] text-gray-700 dark:text-gray-200 truncate">{attachment.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Thread Actions Footer */}
                    <div className="flex flex-wrap items-center gap-2 mt-6 md:pl-11" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => {
                        e.stopPropagation(); openCompose("reply", {
                          messageId: threadMsgDetail?.id || msg.id,
                          to: msg.senderEmail,
                          subject: email.subject,
                          body: msg.body,
                          attachments: [],
                          senderName: msg.senderName,
                          date: msg.date
                        });
                      }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Reply size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Reply</span>
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        const detail = threadMsgDetail || apiMessage;
                        let replyTo = msg.senderEmail;
                        let replyCc: string[] = [];
                        if (detail) {
                          replyTo = detail.from?.[0]?.email || msg.senderEmail;
                          const ccEmails = new Set<string>();
                          detail.to?.forEach((t: any) => t.email !== replyTo && ccEmails.add(t.email));
                          detail.cc?.forEach((c: any) => c.email !== replyTo && ccEmails.add(c.email));
                          replyCc = Array.from(ccEmails);
                        }
                        openCompose("replyAll", {
                          messageId: threadMsgDetail?.id || msg.id,
                          to: replyTo,
                          cc: replyCc.length > 0 ? replyCc.join(', ') : undefined,
                          subject: email.subject,
                          body: fullThreadBody
                        });
                      }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <ReplyAll size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Reply all</span>
                      </button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        openCompose("forward", {
                          subject: email.subject,
                          body: msg.body,
                          date: threadMsgDetail?.sent_at || threadMsgDetail?.received_at || msg.date,
                          senderName: threadMsgDetail?.from?.[0]?.name || msg.senderName || email.senderName,
                          senderEmail: threadMsgDetail?.from?.[0]?.email || msg.senderEmail || email.senderEmail,
                          to: threadMsgDetail?.to?.map((t: any) => t.email).join(', ') || msg.recipientEmail || email.recipientEmail,
                          from: threadMsgDetail?.from || [{ name: msg.senderName, email: msg.senderEmail }]
                        });
                      }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Forward size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Forward</span>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openCompose("editAsNew", { subject: email.subject, body: msg.body }); }} className="cursor-pointer h-8 px-3 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Edit2 size={13} className="text-text-secondary" />
                        <span className="text-[12px] font-medium text-text-primary">Edit as new</span>
                      </button>

                      {threadMsgDetail?.reactions && (() => {
                        const groupedReactions = (threadMsgDetail.reactions || []).reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);
                        const userEmail = "admin@localhost";

                        return Object.entries(groupedReactions).map(([emoji, count]) => {
                          const hasReacted = threadMsgDetail.reactions?.some(r => r.emoji === emoji && r.user_email === userEmail) || false;
                          return (
                            <ReactionBubble
                              key={emoji}
                              emoji={emoji}
                              count={count}
                              hasReacted={hasReacted}
                              onClick={() => threadMsgDetail.id && handleReactionToggle(threadMsgDetail.id, emoji)}
                            />
                          );
                        });
                      })()}

                      {/* <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setActiveReactionPicker(activeReactionPicker === (threadMsgDetail?.id || msg.id) ? null : (threadMsgDetail?.id || msg.id)); }} className="cursor-pointer h-8 px-2 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <Smile size={13} className="text-text-secondary" />
                        </button>
                        {activeReactionPicker === (threadMsgDetail?.id || msg.id) && (
                          <EmojiPicker
                            onSelect={(emoji) => (threadMsgDetail?.id || msg.id) && handleReactionToggle(threadMsgDetail?.id || msg.id, emoji)}
                            onClose={() => setActiveReactionPicker(null)}
                          />
                        )}
                      </div> */}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[12.5px] font-semibold text-text-secondary">
                        {msg.senderName.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-semibold text-[13.5px] text-text-primary shrink-0">{msg.senderName}</span>
                        {isLatest && (
                          <div title="Latest Message" className="w-1.5 h-1.5 rounded-sm bg-black dark:bg-white opacity-40 hover:opacity-100 transition-opacity cursor-help shrink-0"></div>
                        )}
                      </div>
                      <span className="text-[13px] text-text-secondary truncate">{msg.body ? msg.body.split('\n')[0] : ''}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-[12px] text-text-secondary">{msg.date}</span>
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
        <div className={clsx("bg-bg-surface rounded-2xl p-6 md:p-8 relative z-10 border border-border-divider overflow-hidden")}>
          <div className="-mx-6 md:-mx-8 md:pl-0 email-content-wrapper mt-4">
            <EmailContentRenderer html={mainHtml} />
          </div>

          {/* Attachments Section */}
          {apiMessage && apiMessage.attachments && apiMessage.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border-divider">
              <h4 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Paperclip size={14} />
                Attachments ({apiMessage.attachments.length})
              </h4>
              <div className="flex flex-wrap gap-3">
                {apiMessage.attachments.map((attachment, idx) => (
                  <div onClick={() => handleAttachmentClick(attachment)} key={idx} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg border border-border-divider hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                    {attachment.type?.startsWith('image/') || attachment.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <ImageIcon size={14} className="text-blue-500 shrink-0" />
                    ) : (
                      <Paperclip size={14} className="text-orange-500 shrink-0" />
                    )}
                    <span className="text-[13px] font-medium text-text-primary truncate max-w-[150px]">{attachment.name || 'Unnamed file'}</span>
                    <span className="text-[11px] text-text-tertiary">
                      {formatSize(attachment.size)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <style>{`
            .email-content {
              line-height: 1.6;
            }
            .email-content p {
              margin-bottom: 1em;
            }
            .email-content a {
              color: #3b82f6;
              text-decoration: underline;
            }
            .email-content a:hover {
              color: #2563eb;
            }
            .email-content strong, .email-content b {
              font-weight: 600;
            }
            .email-content em, .email-content i {
              font-style: italic;
            }
            .email-content ul, .email-content ol {
              margin-left: 1.5em;
              margin-bottom: 1em;
            }
            .email-content li {
              margin-bottom: 0.5em;
            }
            .email-content blockquote {
              border-left: 3px solid #e5e7eb;
              padding-left: 1em;
              margin: 1em 0;
              color: #6b7280;
            }
            .quote-container-wrapper > .email-content > blockquote:first-child,
            .quote-container-wrapper > .email-content > div.gmail_quote:first-child,
            .quote-container-wrapper > .email-content > blockquote[type="cite"]:first-child {
              border-left: none !important;
              padding-left: 0 !important;
              margin-left: 0 !important;
              margin-top: 0 !important;
            }
            .email-content code {
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-family: monospace;
              font-size: 0.9em;
            }
            .email-content pre {
              background-color: #f3f4f6;
              padding: 1em;
              border-radius: 6px;
              overflow-x: auto;
              margin: 1em 0;
            }
            .email-content pre code {
              background-color: transparent;
              padding: 0;
            }
            .email-content table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            .email-content th, .email-content td {
              border: 1px solid #e5e7eb;
              padding: 0.5em;
              text-align: left;
            }
            .email-content th {
              background-color: #f9fafb;
              font-weight: 600;
            }
            .email-content img {
              max-width: 100%;
              height: auto;
              border-radius: 4px;
            }
            .email-content h1, .email-content h2, .email-content h3, 
            .email-content h4, .email-content h5, .email-content h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
            }
            .email-content h1 { font-size: 1.5em; }
            .email-content h2 { font-size: 1.3em; }
            .email-content h3 { font-size: 1.1em; }
          `}</style>

          {/* Quick Actions Footer */}
          {folder !== 'drafts' && folder !== 'scheduled' && (
            <div className="flex items-center gap-2 mt-8">
              <button onClick={() => openCompose("reply", {
                messageId: apiMessage?.id,
                to: apiMessage?.from?.[0]?.email || email.senderEmail,
                subject: email.subject,
                body: email.body,
                date: email.date,
                senderName: apiMessage?.from?.[0]?.name || email.senderName
              })} className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Reply size={14} className="text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Reply</span>
              </button>
              <button onClick={() => {
                const detail = apiMessage;
                let replyTo = email.senderEmail;
                let replyCc: string[] = [];
                if (detail) {
                  replyTo = detail.from?.[0]?.email || email.senderEmail;
                  const ccEmails = new Set<string>();
                  detail.to?.forEach((t: any) => t.email !== replyTo && ccEmails.add(t.email));
                  detail.cc?.forEach((c: any) => c.email !== replyTo && ccEmails.add(c.email));
                  replyCc = Array.from(ccEmails);
                }
                openCompose("replyAll", {
                  messageId: apiMessage?.id,
                  to: replyTo,
                  cc: replyCc.length > 0 ? replyCc.join(', ') : undefined,
                  subject: email.subject,
                  body: email.body,
                  date: email.date,
                  senderName: apiMessage?.from?.[0]?.name || email.senderName
                });
              }} className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ReplyAll size={14} className="text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Reply all</span>
              </button>
              <button onClick={() => openCompose("forward", {
                subject: email.subject,
                body: email.body,
                date: apiMessage?.sent_at || apiMessage?.received_at || email.date,
                senderName: apiMessage?.from?.[0]?.name || email.senderName,
                senderEmail: apiMessage?.from?.[0]?.email || email.senderEmail,
                to: apiMessage?.to?.map((t: any) => t.email).join(', ') || email.recipientEmail,
                from: apiMessage?.from
              })} className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <Forward size={14} className="text-text-secondary" />
                <span className="text-[13px] font-medium text-text-primary">Forward</span>
              </button>
              {apiMessage && apiMessage.has_attachment && (
                <button className="cursor-pointer h-9 px-4 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Paperclip size={14} className="text-text-secondary" />
                  <span className="text-[13px] font-medium text-text-primary">{apiMessage.attachments?.length || 0} Attachments</span>
                </button>
              )}

              {apiMessage?.reactions && (() => {
                const groupedReactions = (apiMessage.reactions || []).reduce((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                const userEmail = "admin@localhost"; // same as above

                return Object.entries(groupedReactions).map(([emoji, count]) => {
                  const hasReacted = apiMessage.reactions?.some(r => r.emoji === emoji && r.user_email === userEmail) || false;
                  return (
                    <ReactionBubble
                      key={emoji}
                      emoji={emoji}
                      count={count}
                      hasReacted={hasReacted}
                      onClick={() => apiMessage.id && handleReactionToggle(apiMessage.id, emoji)}
                    />
                  );
                });
              })()}

              {/* <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setActiveReactionPicker(activeReactionPicker === (apiMessage?.id || email.id) ? null : (apiMessage?.id || email.id)); }} className="cursor-pointer w-9 h-9 rounded-full bg-white dark:bg-black/5 border border-border-divider flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Smile size={16} className="text-text-secondary" />
                </button>
                {activeReactionPicker === (apiMessage?.id || email.id) && (
                  <EmojiPicker
                    onSelect={(emoji) => (apiMessage?.id || email.id) && handleReactionToggle(apiMessage?.id || email.id, emoji)}
                    onClose={() => setActiveReactionPicker(null)}
                  />
                )}
              </div> */}
            </div>
          )}
        </div>

        {/* Separated Quote Container */}
        {quoteHtml && (
          <div className="relative">
            {/* Thread Line connecting to the main message */}
            <div className="w-[2px] h-8 bg-border-divider ml-[38px] my-0 z-0 relative"></div>
            <div
              onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
              className={clsx(
                "bg-bg-surface rounded-2xl transition-colors cursor-pointer relative z-10 border border-border-divider",
                isQuoteExpanded ? "p-6 md:p-8" : "p-4 hover:bg-bg-surface-hover flex items-center justify-between"
              )}
            >
              {!isQuoteExpanded ? (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-bg-surface-active shrink-0 overflow-hidden flex items-center justify-center text-[12.5px] font-semibold text-text-secondary">
                      <MoreHorizontal size={16} />
                    </div>
                    <span className="font-semibold text-[13.5px] text-text-primary shrink-0">Show quoted history</span>
                  </div>
                </>
              ) : (
                <div className="md:pl-0 email-content-wrapper cursor-text quote-container-wrapper">
                  <EmailContentRenderer html={quoteHtml} />
                </div>
              )}
            </div>
          </div>
        )}
        {/* Final Thread Line connecting to the reply actions */}
        <div className="w-[2px] h-8 bg-border-divider ml-[38px] my-0 z-0 relative"></div>

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
              <button onClick={() => openCompose("reply", {
                messageId: apiMessage?.id,
                to: apiMessage?.from?.[0]?.email || email.senderEmail,
                subject: email.subject,
                body: email.body,
                date: email.date,
                senderName: apiMessage?.from?.[0]?.name || email.senderName
              })} className="cursor-pointer h-10 px-6 rounded-full bg-blue-600 border border-blue-500 flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                <Reply size={15} className="text-white" />
                <span className="text-[14px] font-semibold text-white">Reply</span>
              </button>
              <button onClick={() => openCompose("forward", {
                subject: email.subject,
                body: email.body,
                date: apiMessage?.sent_at || apiMessage?.received_at || email.date,
                senderName: apiMessage?.from?.[0]?.name || email.senderName,
                senderEmail: apiMessage?.from?.[0]?.email || email.senderEmail,
                to: apiMessage?.to?.map((t: any) => t.email).join(', ') || email.recipientEmail,
                from: apiMessage?.from
              })} className="cursor-pointer h-10 px-6 rounded-full bg-bg-surface border border-border-divider flex items-center gap-2 hover:bg-bg-surface-hover transition-colors shadow-sm">
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

function EmojiPicker({ onSelect, onClose }: { onSelect: (emoji: string) => void, onClose: () => void }) {
  return (
    <div className="absolute bottom-full mb-2 z-50 shadow-xl rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <EmojiPickerReact
        onEmojiClick={(emojiData) => { onSelect(emojiData.emoji); onClose(); }}
        theme={Theme.AUTO}
        lazyLoadEmojis={true}
        skinTonesDisabled
        searchDisabled
        height={350}
        width={300}
      />
    </div>
  );
}

function ReactionBubble({ emoji, count, hasReacted, onClick }: { emoji: string, count: number, hasReacted: boolean, onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={clsx(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-medium transition-colors border cursor-pointer",
        hasReacted
          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
          : "bg-white dark:bg-black/5 border-border-divider text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
      )}
    >
      <span>{emoji}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
