import { Search, Filter, Tag, Reply, Trash2, Star, MoreHorizontal, Mail, Inbox, BadgeCheck, Archive, ArchiveX, Clock, AlertCircle, CheckCircle2, Check, CheckCheck, Eye, Send, Save, Loader2, CheckIcon, Paperclip, FolderOpen, Folder, ChevronRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useCompose } from "../context/ComposeContext";
import { useMail } from "../context/MailContext";
import { createPortal } from "react-dom";

export function MessageList({
  emails = [],
  selectedId,
  onSelect,
  checkedIds,
  onToggleCheck,
  onDelete,
  onMarkAsRead,
  folder = 'inbox',
  isLoading = false,
  apiError = null,
  onRefresh,
}: {
  emails?: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  checkedIds?: Set<string>;
  onToggleCheck?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  folder?: string;
  isLoading?: boolean;
  apiError?: string | null;
  onRefresh?: () => void;
}) {
  const {
    markMessageAsRead,
    markMessageAsUnread,
    toggleStarMessage,
    archiveMailMessage,
    unarchiveMailMessage,
    moveMailMessage,
    trashMailMessage,
    restoreMailMessage,
    spamMailMessage,
    refreshFolders,
    folders
  } = useMail();

  // Helper functions to extract data from API response
  const getSenderEmail = (email: any) => email.from?.[0]?.email || '';
  const getSenderName = (email: any) => {
    const senderEmail = getSenderEmail(email);
    return senderEmail.split('@')[0] || '';
  };
  const getRecipientEmail = (email: any) => email.to?.[0]?.email || '';
  const getRecipientName = (email: any) => {
    const recipientEmail = getRecipientEmail(email);
    return recipientEmail.split('@')[0] || '';
  };
  const getDisplayName = (email: any) => {
    // For drafts and sent items, show recipient (To field)
    if (email.is_draft || folder === 'sent') {
      return getRecipientName(email) || 'No recipient';
    }
    // For regular emails, show sender
    return getSenderName(email);
  };
  const getDisplayEmail = (email: any) => {
    // For drafts and sent items, show recipient (To field)
    if (email.is_draft || folder === 'sent') {
      return getRecipientEmail(email) || '';
    }
    // For regular emails, show sender
    return getSenderEmail(email);
  };
  const getAvatarLetter = (email: any) => {
    const displayEmail = email.is_draft || folder === 'sent' ? getRecipientEmail(email) : getSenderEmail(email);
    return displayEmail.charAt(0).toUpperCase();
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle mail click - mark as read and select
  const handleMailClick = async (email: any) => {
    // If it's a draft, open compose modal instead of selecting
    if (email.is_draft) {
      // Only pass the backend ID, let ComposeModal fetch full data
      openCompose("draft", { id: email.id });
      return;
    }

    onSelect(email.id);

    // Mark as read if currently unread
    if (!email.is_read) {
      const success = await markMessageAsRead(email.id);
      if (success) {
        // Update local state
        email.is_read = true;
        // Refresh to update sidebar counts
        onRefresh?.();
        refreshFolders();
      }
    }
  };

  // Handle star toggle
  const handleStarToggle = async (e: React.MouseEvent, email: any) => {
    e.stopPropagation();
    const success = await toggleStarMessage(email.id, email.is_starred);
    if (success) {
      // Update local state
      email.is_starred = !email.is_starred;
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle delete/trash
  const handleDelete = async (e: React.MouseEvent, email: any) => {
    e.stopPropagation();
    const success = await trashMailMessage(email.id);
    if (success) {
      onDelete?.(email.id);
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle read/unread toggle
  const handleReadToggle = async (email: any) => {
    const success = email.is_read
      ? await markMessageAsUnread(email.id)
      : await markMessageAsRead(email.id);
    if (success) {
      // Update local state
      email.is_read = !email.is_read;
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle archive
  const handleArchive = async (email: any) => {
    // Find the archive folder ID
    const archiveFolder = folders.find(f => f.key === 'archive' || f.name.toLowerCase() === 'archive');

    if (archiveFolder) {
      // Use move endpoint to move to archive folder
      const success = await moveMailMessage(email.id, archiveFolder.id);
      if (success) {
        onSelect(""); // Close the viewer if open
        // Refresh to update sidebar counts
        onRefresh?.();
        refreshFolders();
      }
    } else {
      // Fallback to archive endpoint if archive folder not found
      const success = await archiveMailMessage(email.id);
      if (success) {
        onSelect(""); // Close the viewer if open
        // Refresh to update sidebar counts
        onRefresh?.();
        refreshFolders();
      }
    }
  };

  // Handle unarchive
  const handleUnarchive = async (email: any) => {
    // Try multiple approaches to find inbox ID
    let inboxId = folders.find(f => f.key === 'inbox')?.id;

    // If not found by key, try by name
    if (!inboxId) {
      inboxId = folders.find(f => f.name.toLowerCase() === 'inbox')?.id;
    }

    console.log('Unarchive attempt - folders:', folders, 'found inboxId:', inboxId);

    if (!inboxId) {
      console.error('No inbox folder ID found for unarchive. Available folders:', folders);
      return;
    }

    // Use move endpoint to move to inbox
    const success = await moveMailMessage(email.id, inboxId);
    console.log('Unarchive success:', success);
    if (success) {
      onSelect(""); // Close the viewer if open
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle spam
  const handleSpam = async (email: any) => {
    const success = await spamMailMessage(email.id);
    if (success) {
      onSelect(""); // Close the viewer if open
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle move to folder
  const handleMove = async (email: any, mailboxId: string) => {
    const success = await moveMailMessage(email.id, mailboxId);
    if (success) {
      onSelect(""); // Close the viewer if open
      // Refresh to update sidebar counts
      onRefresh?.();
      refreshFolders();
    }
  };

  // Handle restore
  const handleRestore = async (email: any) => {
    const success = await restoreMailMessage(email.id);
    if (success) {
      onSelect(""); // Close the viewer if open
      onRefresh?.();
      refreshFolders();
    }
  };
  const [tab, setTab] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openMoveSubmenu, setOpenMoveSubmenu] = useState(false);
  const [openAbove, setOpenAbove] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousEmails, setPreviousEmails] = useState<any[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [openDeliveredTooltip, setOpenDeliveredTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const tooltipPortalRef = useRef<HTMLDivElement | null>(null);
  const menuPortalRef = useRef<HTMLDivElement | null>(null);
  const { openCompose } = useCompose();

  // Create portal container on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      tooltipPortalRef.current = document.createElement('div');
      tooltipPortalRef.current.className = 'fixed inset-0 pointer-events-none z-[99999]';
      document.body.appendChild(tooltipPortalRef.current);

      menuPortalRef.current = document.createElement('div');
      menuPortalRef.current.className = 'fixed inset-0 pointer-events-none z-[99999]';
      document.body.appendChild(menuPortalRef.current);

      return () => {
        if (tooltipPortalRef.current) {
          document.body.removeChild(tooltipPortalRef.current);
        }
        if (menuPortalRef.current) {
          document.body.removeChild(menuPortalRef.current);
        }
      };
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
        setOpenMoveSubmenu(false);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Save scroll position before selection changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      scrollPositionRef.current = container.scrollTop;
    }
  }, [selectedId]);

  // Handle smooth loading transitions
  useEffect(() => {
    if (isLoading && emails.length > 0) {
      setPreviousEmails(emails);
      setIsTransitioning(true);
    } else if (!isLoading) {
      setIsTransitioning(false);
    }
  }, [isLoading, emails]);

  // Track individual email updates for smooth transitions
  useEffect(() => {
    if (previousEmails.length > 0 && emails.length > 0) {
      const changedIds = new Set<string>();
      emails.forEach((email: any) => {
        const prevEmail = previousEmails.find((e: any) => e.id === email.id);
        if (prevEmail && prevEmail.is_read !== email.is_read) {
          changedIds.add(email.id);
        }
      });
      setUpdatingIds(changedIds);

      // Clear updating state after transition
      const timer = setTimeout(() => setUpdatingIds(new Set()), 300);
      return () => clearTimeout(timer);
    }
  }, [emails, previousEmails]);

  // Close menu when transitioning to prevent issues
  useEffect(() => {
    if (isTransitioning) {
      setOpenMenuId(null);
    }
  }, [isTransitioning]);

  // Restore scroll position after emails render
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && scrollPositionRef.current > 0) {
      container.scrollTop = scrollPositionRef.current;
    }
  }, [emails]);

  return (
    <div id="tour-message-list" className={clsx(
      "h-full bg-bg-main flex flex-col shrink-0 z-10 transition-all duration-300",
      selectedId ? "w-[380px]" : "w-full"
    )}>



      {/* Tabs */}
      {/* <div className="px-4 pb-4 border-b border-border-divider">
        <div className="flex w-full bg-bg-main rounded-lg p-1 border border-border-divider">
          {["All", "Unread", "Archived"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "flex-1 text-[13px] py-1.5 rounded-md transition-colors",
                tab === t ? "bg-bg-surface-active text-text-primary font-medium shadow-sm" : "text-text-secondary hover:text-text-secondary"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div> */}

      {/* Email List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar relative">
        {isLoading && !isTransitioning ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-3" />
            <p className="text-text-tertiary text-[14px]">Loading messages...</p>
          </div>
        ) : apiError && (isTransitioning ? previousEmails : emails).length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
            <div className="w-24 h-24 rounded-[32px] bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-red-100 dark:bg-red-500/20 rounded-[32px] blur-xl -z-10" />
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-text-primary text-[22px] font-semibold tracking-tight mb-2">
              Something went wrong
            </h3>
            {/* <p className="text-text-tertiary text-[14px] text-center max-w-[260px] leading-relaxed">
              {apiError || 'Failed to connect to mail server. Retrying in background...'}
            </p> */}
          </div>
        ) : (isTransitioning ? previousEmails : emails).length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
            <div className="w-24 h-24 rounded-[32px] bg-transparent flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-transparent rounded-[32px] blur-xl -z-10" />
              <img src="/logo/logo-01.png" alt="Norest Mail Logo" className="w-12 h-auto object-contain brightness-0 dark:invert opacity-100" />
            </div>
            <h3 className="text-text-primary text-[22px] font-semibold tracking-tight mb-2">
              {folder === 'drafts' ? 'No drafts yet' : folder === 'scheduled' ? 'No scheduled emails' : folder === 'sent' ? 'Nothing sent yet' : folder === 'trash' ? 'Trash is empty' : folder === 'spam' ? 'No spam emails' : 'You\'re all caught up!'}
            </h3>
            <p className="text-text-tertiary text-[14px] text-center max-w-[260px] leading-relaxed">
              {folder === 'drafts' ? 'Your unfinished emails will appear here.' :
                folder === 'sent' ? 'Your sent folder is empty. Sent messages will appear here.' :
                  folder === 'scheduled' ? 'You have no scheduled emails.' :
                    folder === 'spam' ? 'Your spam folder is empty. Spam emails will appear here.' :
                      folder === 'subscriptions' ? 'You have no mailing lists to unsubscribe from.' :
                        ['inbox', 'archive', 'trash', 'spam', 'notifications'].includes(folder) ?
                          `Your ${folder === 'inbox' ? 'inbox' : folder === 'archive' ? 'archive' : folder === 'trash' ? 'trash' : folder === 'spam' ? 'spam folder' : folder === 'notifications' ? 'notifications' : folder} is clear. New messages will appear here.` :
                          `You have no emails with the "${folder.charAt(0).toUpperCase() + folder.slice(1)}" label.`}
            </p>
          </div>
        ) : (
          <>
            {isTransitioning && (
              <div className="absolute inset-0 bg-bg-main/50 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin opacity-60" />
              </div>
            )}
            {(isTransitioning ? previousEmails : emails).map((email, index) => (
              <div
                key={email.id}
                onClick={() => {
                  handleMailClick(email);
                }}
                onMouseLeave={() => {
                  setOpenDeliveredTooltip(null);
                }}
                className={clsx(
                  "p-4 border-b border-dashed cursor-pointer group transition-all duration-300 relative",
                  updatingIds.has(email.id) ? "opacity-50 scale-[0.98]" : "opacity-100 scale-100",
                  !email.is_read
                    ? selectedId === email.id
                      ? "bg-blue-800 border-blue-600"
                      : "bg-blue-700 border-blue-600 hover:bg-blue-800"
                    : selectedId === email.id
                      ? "bg-bg-surface-hover border-border-divider"
                      : "hover:bg-bg-surface border-border-divider"
                )}
              >
                <div className="flex gap-3">
                  {/* Avatar / Checkbox Container */}
                  <div className="w-10 h-10 shrink-0 relative flex items-center justify-center">
                    {/* Checkbox */}
                    <div
                      className={clsx(
                        "absolute inset-0 flex items-center justify-center cursor-pointer z-10 transition-opacity duration-200",
                        checkedIds?.has(email.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                      onClick={(e) => { e.stopPropagation(); onToggleCheck?.(email.id); }}
                    >
                      <input
                        type="checkbox"
                        checked={checkedIds?.has(email.id) || false}
                        readOnly
                        className="w-[15px] h-[15px] rounded-[4px] border-border-divider cursor-pointer accent-blue-600"
                      />
                    </div>
                    {/* Avatar Placeholder */}
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-[12px] font-medium transition-opacity duration-200",
                        !email.is_read ? "bg-blue-500 text-white" : "bg-bg-surface-active text-text-secondary",
                        checkedIds?.has(email.id) ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                      )}
                    >
                      {getAvatarLetter(email)}
                    </div>
                  </div>

                  {/* Main Content - Left Column */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={clsx("flex items-center gap-1.5 text-[13px] truncate font-bold", !email.is_read ? "text-white" : "text-text-primary")}>
                        <span>{getDisplayName(email)}</span>
                        {email.messageCount && email.messageCount > 1 && (
                          <span className="ml-1 text-[11px] text-text-tertiary font-normal bg-bg-surface px-1.5 py-0.5 rounded-full">
                            {email.messageCount}
                          </span>
                        )}
                        <span className={clsx("text-[12px] font-medium", !email.is_read ? "text-white/80" : "text-black dark:text-white/70")}>&lt; {getDisplayEmail(email)} &gt;</span>
                        {email.has_attachment && <Paperclip size={12} className={clsx("shrink-0", !email.is_read ? "text-white" : "text-text-secondary")} />}
                        {email.is_draft && (
                          <span className="flex items-center gap-1 ml-1 text-[10px] text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-500/20 px-1.5 py-0.5 rounded">
                            <Save size={8} /> Draft
                          </span>
                        )}
                        {folder === 'spam' && (
                          <span className="flex items-center gap-1 ml-1 text-[10px] text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 px-1.5 py-0.5 rounded">
                            <AlertCircle size={8} /> Spam
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {folder !== 'trash' && folder !== 'spam' && (
                          <Star
                            size={12}
                            onClick={(e) => handleStarToggle(e, email)}
                            className={clsx(
                              "shrink-0 mt-0.5 cursor-pointer",
                              email.is_starred
                                ? "text-yellow-500 fill-yellow-500"
                                : (!email.is_read ? "text-blue-200 group-hover:text-white" : "text-text-tertiary group-hover:text-text-secondary")
                            )}
                          />
                        )}
                        {folder === 'sent' && (
                          <button
                            onClick={(e) => handleDelete(e, email)}
                            className={clsx(
                              "cursor-pointer h-5 px-2 rounded-full border flex items-center justify-center transition-all",
                              !email.is_read
                                ? "bg-blue-600 border-blue-500 hover:bg-red-600 hover:border-red-500 text-white"
                                : "bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-red-900 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 text-gray-500"
                            )}
                          >
                            <Trash2 size={10} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-0.5">
                      <span className={clsx("text-[12px] font-medium", !email.is_read ? "text-white font-semibold" : "text-text-primary")}>{email.subject}</span>
                    </div>

                    <p className={clsx("text-[11px] line-clamp-2 leading-snug", !email.is_read ? "text-blue-100" : "text-text-secondary")}>
                      {email.preview}
                    </p>
                  </div>

                  {/* Right Column - Date and Size */}
                  <div className="flex flex-col items-end justify-start shrink-0 pl-4">
                    <span className={clsx("text-[10px] text-right max-w-[120px] break-words", !email.is_read ? "text-blue-200" : "text-text-secondary")}>
                      {formatDate(email.received_at || email.sent_at)}
                    </span>
                    <span className={clsx("text-[9px] text-right mt-0.5", !email.is_read ? "text-blue-300/70" : "text-text-tertiary")}>
                      {formatSize(email.size)}
                    </span>
                  </div>
                </div>

                {/* Gradient mask to hide text under hover actions when hovered */}
                {folder !== 'sent' && (
                  <div className={clsx(
                    "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-50% to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-0 transition-opacity",
                    !email.is_read ? "from-blue-700" : "from-bg-surface"
                  )} />
                )}

                {/* Hover Actions */}
                {folder !== 'sent' && (
                  <div className={clsx("absolute bottom-3 left-[52px] right-4 flex items-center justify-between transition-opacity pointer-events-none z-10", openMenuId === email.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    <div className="flex gap-2 pointer-events-auto relative">
                      {email.is_draft ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); openCompose("draft", { id: email.id }); }}
                          className={clsx(
                            "cursor-pointer h-6 px-3 rounded-full border flex items-center gap-1.5 transition-all",
                            !email.is_read
                              ? "bg-blue-600 border-blue-500 hover:bg-blue-500 text-white"
                              : "bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <Save size={12} strokeWidth={2.5} className={!email.is_read ? "text-white" : "text-gray-700 dark:text-gray-300"} />
                          <span className={clsx("text-[10px] font-semibold", !email.is_read ? "text-white" : "text-gray-700 dark:text-gray-300")}>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); openCompose("reply", email); }}
                          className={clsx(
                            "cursor-pointer h-6 px-3 rounded-full border flex items-center gap-1.5 transition-all",
                            !email.is_read
                              ? "bg-blue-600 border-blue-500 hover:bg-blue-500 text-white"
                              : "bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <Reply size={12} strokeWidth={2.5} className={!email.is_read ? "text-white" : "text-gray-700 dark:text-gray-300"} />
                          <span className={clsx("text-[10px] font-semibold", !email.is_read ? "text-white" : "text-gray-700 dark:text-gray-300")}>Reply</span>
                        </button>
                      )}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (openMenuId === email.id) {
                              setOpenMenuId(null);
                            } else {
                              // Measure space below the button to decide direction
                              const btn = menuBtnRefs.current.get(email.id);
                              if (btn) {
                                const rect = btn.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setOpenAbove(spaceBelow < 260);
                                setMenuPosition({ x: rect.left, y: rect.bottom });
                              }
                              setOpenMenuId(email.id);
                            }
                          }}
                          ref={(el) => { if (el) menuBtnRefs.current.set(email.id, el); }}
                          className={clsx(
                            "cursor-pointer h-6 px-2.5 rounded-full border flex items-center justify-center transition-all",
                            !email.is_read
                              ? clsx("bg-blue-600 border-blue-500 hover:bg-blue-500", openMenuId === email.id && "bg-blue-500")
                              : clsx("bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]", openMenuId === email.id && "bg-gray-100 dark:bg-[#2A2A2A]")
                          )}
                        >
                          <MoreHorizontal size={12} strokeWidth={2.5} className={!email.is_read ? "text-white" : "text-gray-700 dark:text-gray-300"} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, email)}
                      className={clsx(
                        "cursor-pointer h-6 px-2.5 rounded-full border flex items-center justify-center transition-all pointer-events-auto",
                        !email.is_read
                          ? "bg-blue-600 border-blue-500 hover:bg-red-600 hover:border-red-500 text-white"
                          : "bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-red-900 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 text-gray-500"
                      )}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                )}


              </div>
            ))}
          </>
        )}
      </div>

      {/* Portal for tooltip */}
      {tooltipPortalRef.current && openDeliveredTooltip && createPortal(
        <div
          className="px-2.5 bg-black dark:bg-white rounded-none shadow-xl pointer-events-none"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <span style={{ position: 'relative', top: '-1px' }} className="text-[10px] font-semibold text-white dark:text-black whitespace-nowrap">
            Delivered
          </span>

          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black dark:bg-white rotate-45"></div>
        </div>,
        tooltipPortalRef.current
      )}

      {/* Portal for dropdown menu */}
      {menuPortalRef.current && openMenuId && (() => {
        const currentEmails = isTransitioning ? previousEmails : emails;
        const email = currentEmails.find((e: any) => e.id === openMenuId);
        if (!email) return null;

        // Determine if we should show Archive or Unarchive based on current folder
        const isArchiveFolder = folder === 'archive';
        const isTrashFolder = folder === 'trash';

        // Build menu items based on current folder
        const menuItems: Array<{ icon: any, label: string, action: () => void, hasSubmenu?: boolean }> = [];

        // Read / Unread
        menuItems.push({
          icon: email.is_read ? Check : Eye,
          label: email.is_read ? "Mark as unread" : "Mark as read",
          action: () => handleReadToggle(email)
        });

        // Star / Unstar
        menuItems.push({
          icon: Star,
          label: email.is_starred ? "Unstar" : "Star",
          action: () => handleStarToggle({ stopPropagation: () => { } } as any, email)
        });

        // Archive / Unarchive
        if (isArchiveFolder) {
          menuItems.push({
            icon: ArchiveX,
            label: "Unarchive",
            action: () => handleUnarchive(email)
          });
        } else if (!isTrashFolder) {
          menuItems.push({
            icon: Archive,
            label: "Archive",
            action: () => handleArchive(email)
          });
        }

        // Move (with submenu)
        // if (folder !== 'drafts' && folder !== 'sent') {
        //   menuItems.push({
        //     icon: FolderOpen,
        //     label: "Move",
        //     hasSubmenu: true,
        //     action: () => setOpenMoveSubmenu(!openMoveSubmenu)
        //   });
        // }

        // Trash / Restore
        if (isTrashFolder) {
          menuItems.push({
            icon: CheckCircle2,
            label: "Restore",
            action: () => handleRestore(email)
          });
        } else {
          menuItems.push({
            icon: Trash2,
            label: "Trash",
            action: () => handleDelete({ stopPropagation: () => { } } as any, email)
          });
        }

        // Mark as Spam (only if not in spam folder)
        if (folder !== 'junk' && folder !== 'spam') {
          menuItems.push({
            icon: AlertCircle,
            label: "Mark as spam",
            action: () => handleSpam(email)
          });
        }

        return createPortal(
          <div className="relative">
            <div
              className="w-48 bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 rounded-lg shadow-xl py-1.5 pointer-events-auto"
              style={{
                position: 'fixed',
                left: `${menuPosition.x}px`,
                top: openAbove ? `${menuPosition.y - 8}px` : `${menuPosition.y + 8}px`,
                transform: openAbove ? 'translateY(-100%)' : 'translateY(0)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-700 dark:text-gray-300"
                  onClick={() => {
                    if (!item.hasSubmenu) {
                      item.action();
                      setOpenMenuId(null);
                    } else {
                      item.action();
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={12} strokeWidth={2} className="text-gray-500" />
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                  {item.hasSubmenu && <ChevronRight size={10} className="text-gray-400" />}
                </div>
              ))}
            </div>

            {/* Move Submenu */}
            {openMoveSubmenu && createPortal(
              <div
                className="w-40 bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 rounded-lg shadow-xl py-1.5 pointer-events-auto"
                style={{
                  position: 'fixed',
                  left: `${menuPosition.x + 192}px`,
                  top: openAbove ? `${menuPosition.y - 8}px` : `${menuPosition.y + 8}px`,
                  transform: openAbove ? 'translateY(-100%)' : 'translateY(0)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {folders.map((folderItem) => (
                  <div
                    key={folderItem.id}
                    className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-700 dark:text-gray-300"
                    onClick={() => {
                      handleMove(email, folderItem.id);
                      setOpenMenuId(null);
                      setOpenMoveSubmenu(false);
                    }}
                  >
                    <Folder size={12} strokeWidth={2} className="text-gray-500" />
                    <span className="text-[11px] font-medium">{folderItem.name}</span>
                  </div>
                ))}
              </div>,
              menuPortalRef.current
            )}
          </div>,
          menuPortalRef.current
        );
      })()}
    </div>
  );
}
