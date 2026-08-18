"use client";

import {
  PenLine, ChevronDown, Inbox, Star, Clock,
  Pin, Send, File, Users, Info, MessageSquare,
  Tag, MessageCircle, AlertCircle, Trash2, Settings, Mail,
  Archive, FileText, XCircle, Bell, Newspaper, UploadCloud,
  FileWarning, ShieldAlert, BadgeMinus,
  Triangle,
  Square
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useCompose } from "../context/ComposeContext";
import { useMail } from "../context/MailContext";
import { MailFolder } from "../context/MailContext";

export function Sidebar() {
  const pathname = usePathname();
  const { openCompose } = useCompose();
  const { unreadInboxCount, folders, labels } = useMail();

  const isActive = (name: string) => name ? pathname === `/app/${name.toLowerCase()}` : false;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState({
    name: 'Ripun',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  });

  const organizations = [
    { name: 'Ripun', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { name: 'Acme Corp', avatar: 'https://i.pravatar.cc/150?u=acme' },
    { name: 'Sisyphus Ventures', avatar: 'https://i.pravatar.cc/150?u=sisyphus' }
  ];

  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [isLabelsOpen, setIsLabelsOpen] = useState(true);

  if (pathname.startsWith('/app/settings')) {
    const settingsGroups = [
      {
        title: 'General',
        items: ['Account', 'Aliases', 'Mailbox', 'Domain DNS']
      },
      {
        title: 'Mail',
        items: ['Inbox', 'Compose', 'Sending', 'Contacts', 'Receiving', 'Auto Reply', 'Signatures', 'Forwarding', 'Filters & Rules', 'Labels & Folders', 'Calendar Integration']
      },
      {
        title: 'Security',
        items: ['Privacy', 'Security', 'Spam Protection']
      },
      {
        title: 'Workspace',
        items: ['Team', 'Billing', 'Storage', 'Advanced', 'Developer', 'Appearance', 'Integrations', 'Accessibility', 'Notifications', 'Import & Export']
      },
      {
        title: 'Admin',
        items: ['Advanced Settings']
      }
    ];

    return (
      <div className="w-[280px] h-full bg-[#111] flex flex-col shrink-0 overflow-y-auto no-scrollbar z-10 transition-colors">
        {/* Header */}
        <div className="relative px-5 pt-7 pb-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1.5 -ml-1.5 rounded-lg transition-colors select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-[14px] font-semibold text-white leading-tight">Settings</span>
            <span className="text-[14px] text-gray-500">/</span>
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ml-1 border border-gray-700">
              <img src={selectedOrg.avatar} alt={selectedOrg.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[14px] font-semibold text-white leading-tight flex-1">{selectedOrg.name}</span>
            <ChevronDown size={14} className={clsx("text-gray-500 shrink-0 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-[60px] left-5 right-5 bg-[#000] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col p-1 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mailbox
              </div>
              {organizations.map((org) => (
                <button
                  key={org.name}
                  onClick={() => {
                    setSelectedOrg(org);
                    setIsDropdownOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    selectedOrg.name === org.name ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-700">
                    <img src={org.avatar} alt={org.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={clsx("text-[14px] flex-1", selectedOrg.name === org.name ? "text-white font-semibold" : "text-gray-300 font-medium")}>
                    {org.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col pb-8">
          {settingsGroups.map((group) => (
            <div key={group.title} className="flex flex-col mb-4">
              <div className="px-5 py-2">
                <span className="text-[12px] font-bold text-[#666] uppercase tracking-wider">{group.title}</span>
              </div>
              <div className="flex flex-col">
                {group.items.map((tab) => {
                  const expectedPath = tab === 'Account'
                    ? '/app/settings'
                    : `/app/settings/${tab.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`;
                  const active = pathname === expectedPath;

                  return (
                    <Link
                      key={tab}
                      href={expectedPath}
                      className={clsx(
                        "w-full flex items-center px-5 py-[8px] transition-colors relative",
                        active ? "text-white" : "text-[#888] hover:text-white"
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500 rounded-r"></div>
                      )}
                      <span className={clsx("text-[14px]", active ? "font-semibold" : "font-medium")}>
                        {tab}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const folderIcons: Record<string, any> = {
    inbox: Inbox,
    sent: Send,
    send: Send,
    drafts: File,
    trash: Trash2,
    junk: AlertCircle,
    spam: AlertCircle,
    'shield-alert': ShieldAlert,
    archive: Archive,
    clock: Clock,
    newspaper: Newspaper,
    bell: Bell,
    'badge-minus': BadgeMinus,
    starred: Star,
    important: Triangle,
    folder: Square
  };

  const getIconForFolder = (iconKey: string) => {
    return folderIcons[iconKey] || Square;
  };

  if (pathname.startsWith('/app/calendar')) {
    return null;
  }

  const renderFolder = (folder: MailFolder, depth = 0) => {
    const Icon = getIconForFolder(folder.key); // Use folder.key instead of folder.icon since API provides type
    const isSelected = isActive(folder.key);
    const count = folder.unreadCount > 0 ? folder.unreadCount : null;

    return (
      <div key={folder.id} className="w-full">
        <Link
          href={`/app/${folder.key}`}
          className={clsx(
            "w-full flex items-center justify-between py-1.5 rounded-md transition-colors group",
            depth === 0 ? "px-2" : "pr-2",
            isSelected ? "bg-black/5 dark:bg-white/5" : "hover:bg-black/5 dark:hover:bg-white/5"
          )}
          style={{ paddingLeft: depth > 0 ? `${depth * 16 + 8}px` : undefined }}
        >
          <div className="flex items-center gap-2.5">
            <Icon
              size={14}
              className={clsx(
                isSelected ? "text-black dark:text-white fill-black dark:fill-white" : "text-text-secondary group-hover:text-text-primary fill-none group-hover:fill-black/10 dark:group-hover:fill-white/10"
              )}
            />
            <span className={clsx("text-[13px]", isSelected ? "text-black dark:text-white font-semibold" : "text-text-secondary group-hover:text-text-primary font-medium")}>
              {folder.name}
            </span>
          </div>
          {count !== null && count !== 0 && (
            <span className={clsx("text-[12px]", isSelected ? "text-black dark:text-white font-semibold" : "text-text-tertiary font-medium")}>
              {count}
            </span>
          )}
        </Link>
        {folder.children && folder.children.length > 0 && (
          <div className="flex flex-col w-full">
            {folder.children.map(child => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[220px] h-full bg-bg-main border-r-2 border-border-divider flex flex-col shrink-0 overflow-y-auto no-scrollbar pb-6 z-10 transition-colors">
      <div className="p-3 sticky top-0 mt-2 bg-bg-main z-10 transition-colors">
        <button
          id="tour-compose"
          onClick={() => openCompose("new")}
          className="cursor-pointer w-full h-[36px] bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 rounded-lg flex items-center transition-colors border border-black/10 dark:border-transparent shadow-sm"
        >
          <div className="flex-1 flex items-center justify-center gap-2">
            <PenLine size={14} className="text-white dark:text-black stroke-[3]" />
            <span className="text-white dark:text-black font-semibold text-[13px]">New Mail</span>
          </div>
        </button>
      </div>

      <div className="flex flex-col px-2 mt-1 flex-1">
        {/* Folders Section */}
        <div id="tour-folders" className="mb-4">
          <button
            onClick={() => setIsFoldersOpen(!isFoldersOpen)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 text-text-tertiary hover:text-text-primary transition-colors group"
          >
            <ChevronDown size={14} className={clsx("transition-transform duration-200", !isFoldersOpen && "-rotate-90")} />
            <span className="text-[12px] font-semibold uppercase tracking-wider">Folders</span>
          </button>

          {isFoldersOpen && (
            <div className="flex flex-col gap-[1px] mt-1">
              {folders.length === 0 && (
                <div className="px-2 py-1.5 text-[12px] text-text-tertiary">No folders found</div>
              )}
              {folders.map(folder => renderFolder(folder, 0))}
            </div>
          )}
        </div>

        <div className="h-[1px] w-full bg-border-divider my-2"></div>

        {/* Labels Section */}
        <div id="tour-labels" className="mb-4 mt-2">
          <button
            onClick={() => setIsLabelsOpen(!isLabelsOpen)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 text-text-tertiary hover:text-text-primary transition-colors group"
          >
            <ChevronDown size={14} className={clsx("transition-transform duration-200", !isLabelsOpen && "-rotate-90")} />
            <span className="text-[12px] font-semibold uppercase tracking-wider">Labels</span>
          </button>

          {isLabelsOpen && (
            <div className="flex flex-col gap-[1px] mt-1">
              {labels.map((label) => {
                const isSelected = pathname === `/app/labels/${label.name.toLowerCase()}`;
                return (
                  <Link
                    key={label.id}
                    href={`/app/labels/${label.name.toLowerCase()}`}
                    className={clsx(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors group",
                      isSelected ? "bg-black/5 dark:bg-white/5" : "hover:bg-black/5 dark:hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-none" style={{ backgroundColor: label.color }}></div>
                      <span className={clsx("text-[13px]", isSelected ? "text-text-primary font-semibold" : "text-text-secondary group-hover:text-text-primary font-medium")}>
                        {label.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
              <button className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors group mt-1">
                <div className="flex items-center justify-center w-[14px]">
                  <span className="text-[16px] leading-none text-text-tertiary group-hover:text-text-primary mb-[2px]">+</span>
                </div>
                <span className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary">
                  New Label
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings at the bottom */}
      <div className="px-4 mt-auto">
        <div className="h-[1px] w-full bg-border-divider mb-3"></div>
        <Link
          id="tour-settings"
          href="/app/settings"
          className={clsx(
            "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors group",
            pathname.startsWith('/app/settings') ? "bg-black/5 dark:bg-white/5" : "hover:bg-black/5 dark:hover:bg-white/5"
          )}
        >
          <Settings size={14} fill="currentColor" className={pathname.startsWith('/app/settings') ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"} />
          <span className={clsx("text-[13px]", pathname.startsWith('/app/settings') ? "text-text-primary font-semibold" : "text-text-secondary group-hover:text-text-primary font-medium")}>
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
