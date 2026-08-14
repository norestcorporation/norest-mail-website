import { Search, Filter, Tag, Reply, Trash2, Star, MoreHorizontal, Mail, Inbox, BadgeCheck, Archive, Clock, AlertCircle, CheckCircle2, Check, CheckCheck, Eye, Send, Save, Loader2, CheckIcon } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import { useCompose } from "../context/ComposeContext";
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
}) {
  const [tab, setTab] = useState("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openAbove, setOpenAbove] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousEmails, setPreviousEmails] = useState<any[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [openDeliveredTooltip, setOpenDeliveredTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const menuBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const tooltipPortalRef = useRef<HTMLDivElement | null>(null);
  const { openCompose } = useCompose();

  // Create portal container on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      tooltipPortalRef.current = document.createElement('div');
      tooltipPortalRef.current.className = 'fixed inset-0 pointer-events-none z-[99999]';
      document.body.appendChild(tooltipPortalRef.current);
      return () => {
        if (tooltipPortalRef.current) {
          document.body.removeChild(tooltipPortalRef.current);
        }
      };
    }
  }, []);

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
        if (prevEmail && prevEmail.isUnread !== email.isUnread) {
          changedIds.add(email.id);
        }
      });
      setUpdatingIds(changedIds);

      // Clear updating state after transition
      const timer = setTimeout(() => setUpdatingIds(new Set()), 300);
      return () => clearTimeout(timer);
    }
  }, [emails, previousEmails]);

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
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : (isTransitioning ? previousEmails : emails).length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
            <div className="w-24 h-24 rounded-[32px] bg-transparent flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-transparent rounded-[32px] blur-xl -z-10" />
              <img src="/logo/logo-01.png" alt="Norest Mail Logo" className="w-12 h-auto object-contain brightness-0 dark:invert opacity-100" />
            </div>
            <h3 className="text-text-primary text-[22px] font-semibold tracking-tight mb-2">
              {folder === 'drafts' ? 'No drafts yet' : folder === 'scheduled' ? 'No scheduled emails' : folder === 'sent' ? 'Nothing sent yet' : folder === 'trash' ? 'Trash is empty' : 'You\'re all caught up!'}
            </h3>
            <p className="text-text-tertiary text-[14px] text-center max-w-[260px] leading-relaxed">
              {folder === 'drafts' ? 'Your unfinished emails will appear here.' :
                folder === 'sent' ? 'Your sent folder is empty. Sent messages will appear here.' :
                  folder === 'scheduled' ? 'You have no scheduled emails.' :
                    folder === 'subscriptions' ? 'You have no mailing lists to unsubscribe from.' :
                      ['inbox', 'archive', 'trash', 'spam'].includes(folder) ?
                        `Your ${folder === 'inbox' ? 'inbox' : folder === 'archive' ? 'archive' : folder === 'trash' ? 'trash' : folder === 'spam' ? 'spam folder' : folder} is clear. New messages will appear here.` :
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
                  onSelect(email.id);
                }}
                onMouseLeave={() => {
                  setOpenMenuId(null);
                  setOpenDeliveredTooltip(null);
                }}
                className={clsx(
                  "p-4 border-b border-dashed cursor-pointer group transition-all duration-300 relative",
                  updatingIds.has(email.id) ? "opacity-50 scale-[0.98]" : "opacity-100 scale-100",
                  email.isUnread
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
                        email.isUnread ? "bg-blue-500 text-white" : "bg-bg-surface-active text-text-secondary",
                        checkedIds?.has(email.id) ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                      )}
                    >
                      {email.emailDisplay?.username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  </div>

                  {/* Main Content - Left Column */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={clsx("flex items-center gap-1.5 text-[13px] truncate font-bold", email.isUnread ? "text-white" : "text-text-primary")}>
                        <span>{email.emailDisplay?.username || ''}</span>
                        <span className="text-[12px] font-medium text-white/80">&lt; {email.emailDisplay?.email || ''} &gt;</span>
                        {folder === 'sent' && email.deliveryStatus && (
                          <div className="relative">
                            <button
                              ref={(el) => {
                                if (el) menuBtnRefs.current.set(`tick-${email.id}`, el);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (openDeliveredTooltip === email.id) {
                                  setOpenDeliveredTooltip(null);
                                } else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 4 });
                                  setOpenDeliveredTooltip(email.id);
                                }
                              }}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top - 4 });
                                setOpenDeliveredTooltip(email.id);
                              }}
                              onMouseLeave={() => setOpenDeliveredTooltip(null)}
                              className={clsx(
                                "w-4 h-4 rounded-full flex items-center justify-center",
                                email.isUnread ? "bg-white" : "bg-black dark:bg-white"
                              )}
                            >
                              <Check 
                                size={10} 
                                strokeWidth={5} 
                                className={clsx(
                                  email.isUnread ? "text-blue-600" : "text-white dark:text-black"
                                )} 
                              />
                            </button>
                          </div>
                        )}
                        {email.isOfficial && <BadgeCheck size={14} className={clsx("shrink-0", email.isUnread ? "text-white [&>*:first-child]:fill-white [&>*:last-child]:stroke-blue-700" : "text-blue-500 [&>*:first-child]:fill-blue-500 [&>*:last-child]:stroke-white")} />}
                        {folder === 'drafts' && email.autoSaved && (
                          <span className="flex items-center gap-1 ml-1 text-[10px] text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
                            <Save size={8} /> Auto saved
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {folder !== 'trash' && folder !== 'spam' && <Star size={12} className={clsx("shrink-0 mt-0.5 cursor-pointer", email.isUnread ? "text-blue-200 group-hover:text-white" : "text-text-tertiary group-hover:text-text-secondary")} />}
                        {folder === 'sent' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete?.(email.id); }}
                            className={clsx(
                              "cursor-pointer h-5 px-2 rounded-full border flex items-center justify-center transition-all",
                              email.isUnread
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
                      <span className={clsx("text-[12px] font-medium", email.isUnread ? "text-white font-semibold" : "text-text-primary")}>{email.subject}</span>
                    </div>

                    <p className={clsx("text-[11px] line-clamp-2 leading-snug", email.isUnread ? "text-blue-100" : "text-text-secondary")}>
                      {email.snippet || email.preview}
                    </p>
                  </div>

                  {/* Right Column - Date */}
                  <div className="flex flex-col items-end justify-start shrink-0 pl-4">
                    <span className={clsx("text-[10px] text-right max-w-[120px] break-words", email.isUnread ? "text-blue-200" : "text-text-secondary")}>
                      {folder === 'drafts' ? email.lastEdited : folder === 'scheduled' ? email.scheduledTime : folder === 'trash' ? email.deletionDate : email.date}
                    </span>
                  </div>
                </div>

                {/* Gradient mask to hide text under hover actions when hovered */}
                {folder !== 'sent' && (
                  <div className={clsx(
                    "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-50% to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-0 transition-opacity",
                    email.isUnread ? "from-blue-700" : "from-bg-surface"
                  )} />
                )}

                {/* Hover Actions */}
                {folder !== 'sent' && (
                  <div className={clsx("absolute bottom-3 left-[52px] right-4 flex items-center justify-between transition-opacity pointer-events-none z-10", openMenuId === email.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    <div className="flex gap-2 pointer-events-auto relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); openCompose("reply", email); }}
                        className={clsx(
                          "cursor-pointer h-6 px-3 rounded-full border flex items-center gap-1.5 transition-all",
                          email.isUnread
                            ? "bg-blue-600 border-blue-500 hover:bg-blue-500 text-white"
                            : "bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <Reply size={12} strokeWidth={2.5} className={email.isUnread ? "text-white" : "text-gray-700 dark:text-gray-300"} />
                        <span className={clsx("text-[10px] font-semibold", email.isUnread ? "text-white" : "text-gray-700 dark:text-gray-300")}>Reply</span>
                      </button>
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
                              }
                              setOpenMenuId(email.id);
                            }
                          }}
                          ref={(el) => { if (el) menuBtnRefs.current.set(email.id, el); }}
                          className={clsx(
                            "cursor-pointer h-6 px-2.5 rounded-full border flex items-center justify-center transition-all",
                            email.isUnread
                              ? clsx("bg-blue-600 border-blue-500 hover:bg-blue-500", openMenuId === email.id && "bg-blue-500")
                              : clsx("bg-white dark:bg-[#1A1A1A] border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5", openMenuId === email.id && "bg-black/5 dark:bg-white/10")
                          )}
                        >
                          <MoreHorizontal size={12} strokeWidth={2.5} className={email.isUnread ? "text-white" : "text-gray-700 dark:text-gray-300"} />
                        </button>

                        {openMenuId === email.id && (
                          <div
                            className={clsx(
                              "absolute left-0 w-48 bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 rounded-lg shadow-xl py-1.5 z-[100]",
                              openAbove ? "bottom-full mb-2" : "top-full mt-2"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {[
                              { icon: Archive, label: "Archive" },
                              { icon: CheckCircle2, label: "Mark as read" },
                              { icon: Clock, label: "Snooze" },
                              { icon: Star, label: "Add star" },
                              { icon: AlertCircle, label: "Report spam" },
                              { icon: Tag, label: "Add label" }
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer text-gray-700 dark:text-gray-300"
                                onClick={() => {
                                  if (item.label === "Mark as read") {
                                    onMarkAsRead?.(email.id);
                                    setOpenMenuId(null);
                                  }
                                }}
                              >
                                <item.icon size={12} strokeWidth={2} className="text-gray-500" />
                                <span className="text-[11px] font-medium">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete?.(email.id); }}
                      className={clsx(
                        "cursor-pointer h-6 px-2.5 rounded-full border flex items-center justify-center transition-all pointer-events-auto",
                        email.isUnread
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
    </div>
  );
}
