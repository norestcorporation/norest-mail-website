"use client";

import { Check, Archive, ArchiveX, Trash2, MailOpen, MoreHorizontal, Reply, Star, Clock } from "lucide-react";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { ApiMessage } from "@/app/app/api/mockMailApi";

interface SecondaryActionBarProps {
  messages: ApiMessage[];
  checkedIds: Set<string>;
  totalMessages: number;
  isLoading: boolean;
  folderType: "inbox" | "archive" | "trash" | "sent" | "drafts" | "spam" | "scheduled" | "notifications" | "unsubscribe" | "label";
  onToggleAll: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onToggleRead: (ids: string[], markRead: boolean) => void;
  onToggleStar: (ids: string[], currentIsStarred: boolean) => void;
  onReply: (email: ApiMessage) => void;
}

export function SecondaryActionBar({
  messages,
  checkedIds,
  totalMessages,
  isLoading,
  folderType,
  onToggleAll,
  onArchive,
  onUnarchive,
  onDelete,
  onRestore,
  onToggleRead,
  onToggleStar,
  onReply
}: SecondaryActionBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Determine dynamic states based on folder or selection
  const isTrash = folderType === "trash";
  const isArchive = folderType === "archive";
  const hasSelection = checkedIds.size > 0;

  // Calculate if all selected items are starred
  const selectedMessages = messages.filter(m => checkedIds.has(m.id));
  const allStarred = selectedMessages.length > 0 && selectedMessages.every(m => m.isStarred);

  // Calculate if all selected items are read
  // We check isUnread === false (or is_read === true). 
  // If a message has neither, assume read or rely on isUnread.
  const allRead = selectedMessages.length > 0 && selectedMessages.every(m => m.is_read || m.isUnread === false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="h-[48px] border-b border-border-divider bg-bg-surface flex items-center px-4 justify-between shrink-0 transition-colors z-20 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10">
          <div
            onClick={onToggleAll}
            className={clsx(
              "w-[15px] h-[15px] rounded-[4px] border flex items-center justify-center cursor-pointer transition-colors",
              checkedIds.size > 0 ? "bg-blue-600 border-blue-600" : "bg-transparent border-border-divider dark:border-white/20"
            )}
          >
            {checkedIds.size > 0 && checkedIds.size < messages.length && (
              <div className="w-[7px] h-[2px] bg-white rounded-full" />
            )}
            {checkedIds.size > 0 && checkedIds.size === messages.length && (
              <Check size={10} className="text-white" strokeWidth={4} />
            )}
          </div>
        </div>

        <div className={clsx("flex items-center gap-1 transition-opacity duration-200", hasSelection ? "opacity-100 pointer-events-auto" : "opacity-50 pointer-events-none")}>
          {isArchive ? (
            <button onClick={onUnarchive} title="Unarchive" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <ArchiveX size={16} />
            </button>
          ) : (
            <button onClick={onArchive} title="Archive" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              <Archive size={16} />
            </button>
          )}

          <button onClick={isTrash ? onRestore : onDelete} title={isTrash ? "Restore" : "Delete"} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 size={16} />
          </button>

          <button onClick={() => onToggleRead(Array.from(checkedIds), !allRead)} title="Mark as read/unread" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
            <MailOpen size={16} />
          </button>

          <div className="relative">
            <button
              ref={triggerRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-active text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-10 left-0 w-48 bg-bg-panel border border-border-divider rounded-lg shadow-xl py-1 z-50 text-[13px] font-medium text-text-primary overflow-hidden"
              >
                {/* Reply logic - only when exactly 1 message is selected */}
                {checkedIds.size === 1 && (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onReply(selectedMessages[0]);
                    }}
                    className="w-full flex items-center px-3 py-2 hover:bg-bg-surface-active transition-colors"
                  >
                    <Reply size={14} className="mr-3 text-text-tertiary" />
                    Reply
                  </button>
                )}

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onToggleStar(Array.from(checkedIds), allStarred);
                  }}
                  className="w-full flex items-center px-3 py-2 hover:bg-bg-surface-active transition-colors"
                >
                  <Star size={14} className="mr-3 text-text-tertiary" />
                  {allStarred ? "Unstar" : "Star"}
                </button>

                {isArchive ? (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onUnarchive();
                    }}
                    className="w-full flex items-center px-3 py-2 hover:bg-bg-surface-active transition-colors"
                  >
                    <Clock size={14} className="mr-3 text-text-tertiary" />
                    Unsnooze
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onArchive();
                    }}
                    className="w-full flex items-center px-3 py-2 hover:bg-bg-surface-active transition-colors"
                  >
                    <Clock size={14} className="mr-3 text-text-tertiary" />
                    Snooze
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-[13px] text-text-secondary font-medium">
        {checkedIds.size > 0 ? `${checkedIds.size} selected` : (
          isLoading ? 'Loading...' : (
            messages.length > 0 ? `1-${messages.length} of ${totalMessages}` : 'No messages'
          )
        )}
      </div>
    </div>
  );
}
