"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Search, Plus, Mail, Phone, Building2, Star, 
  Edit3, Trash2, Archive, Clock, UserCircle2, ChevronRight,
  Check
} from "lucide-react";
import clsx from "clsx";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  starred?: boolean;
  online?: boolean;
  initials: string;
  accentColor: string;
}

const CONTACTS: Contact[] = [
  { id: "1", name: "Partners", email: "partners@digitalocean.com", company: "DigitalOcean", role: "Business Partner", initials: "PA", accentColor: "#0080FF" },
  { id: "2", name: "Partners", email: "partners@spaceship.com", company: "Spaceship", role: "Business Partner", initials: "PA", accentColor: "#7C3AED" },
  { id: "3", name: "Partners", email: "partners@vultr.com", company: "Vultr", role: "Business Partner", initials: "PA", accentColor: "#00C853" },
  { id: "4", name: "Ripun", email: "hello@theripun.com", company: "Norest Corp", role: "Founder & CEO", initials: "RC", accentColor: "#FF6B35", starred: true, online: true },
  { id: "5", name: "Ripunbasumatary10", email: "ripunbasumatary10@gmail.com", initials: "RB", accentColor: "#E91E8C", online: true },
  { id: "6", name: "Spaceship Support", email: "support@spaceship.com", company: "Spaceship", role: "Support Team", initials: "SS", accentColor: "#00BCD4" },
  { id: "7", name: "V Anaqvi", email: "v-anaqvi@digitalocean.com", company: "DigitalOcean", role: "Account Manager", initials: "VA", accentColor: "#FF9800" },
  { id: "8", name: "Veebodosa", email: "veebodosa@gmail.com", initials: "VE", accentColor: "#4CAF50" },
];

function Avatar({ contact, size = 44 }: { contact: Contact; size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-full flex items-center justify-center font-bold text-white select-none"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${contact.accentColor}cc, ${contact.accentColor}66)`,
        fontSize: size * 0.33,
        boxShadow: `0 0 0 2px ${contact.accentColor}33`,
      }}
    >
      {contact.initials}
      {contact.online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#0a0a0a]" />
      )}
    </div>
  );
}

function ContactRow({ contact, isSelected, onClick }: { contact: Contact; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group",
        isSelected
          ? "bg-black/8 dark:bg-white/8 shadow-sm"
          : "hover:bg-black/5 dark:hover:bg-white/5"
      )}
    >
      <Avatar contact={contact} size={36} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary truncate">{contact.name}</p>
        <p className="text-[11px] text-text-tertiary truncate">{contact.email}</p>
      </div>
      {contact.starred && <Star size={11} className="text-amber-400 shrink-0 fill-amber-400" />}
    </button>
  );
}

function ContactDetail({ contact }: { contact: Contact }) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  return (
    <motion.div
      key={contact.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Hero */}
      <div
        className="flex flex-col items-center pt-10 pb-7 px-6 border-b border-border-divider relative"
        style={{ background: `linear-gradient(180deg, ${contact.accentColor}10 0%, transparent 100%)` }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button title="More options" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer">
            <Edit3 size={14} />
          </button>
        </div>

        <div className="relative mb-4">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-bold text-white text-[22px] shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${contact.accentColor}ee, ${contact.accentColor}88)`,
              boxShadow: `0 8px 32px ${contact.accentColor}44`,
            }}
          >
            {contact.initials}
          </div>
          {contact.online && (
            <span className="absolute bottom-1 right-0.5 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#0d0d0d]" />
          )}
        </div>

        <h2 className="text-[17px] font-bold text-text-primary mb-0.5">{contact.name}</h2>
        {contact.role && <p className="text-[12px] text-text-tertiary mb-1 font-medium">{contact.role}</p>}
        {contact.company && (
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 size={11} className="text-text-tertiary" />
            <span className="text-[12px] text-text-secondary font-semibold">{contact.company}</span>
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-1.5 mt-5">
          {[
            { icon: Mail, label: "Email", danger: false },
            { icon: Archive, label: "Archive", danger: false },
            { icon: Trash2, label: "Delete", danger: true },
          ].map(({ icon: Icon, label, danger }) => (
            <button
              key={label}
              title={label}
              className={clsx(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer border",
                danger
                  ? "text-red-500 border-red-500/20 hover:bg-red-500/10"
                  : "text-text-secondary border-border-divider hover:bg-black/5 dark:hover:bg-white/8 hover:text-text-primary"
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-2 mb-3">General</p>

        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 group transition-colors">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${contact.accentColor}20` }}>
              <Mail size={13} style={{ color: contact.accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider mb-0.5">Email Address</p>
              <button
                onClick={copyEmail}
                className="text-[13px] font-semibold hover:underline cursor-pointer flex items-center gap-1.5 truncate max-w-full"
                style={{ color: contact.accentColor }}
              >
                {contact.email}
                {copyFeedback && <Check size={11} />}
              </button>
            </div>
          </div>

          {contact.phone && (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-green-500/15">
                <Phone size={13} className="text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider mb-0.5">Phone</p>
                <p className="text-[13px] font-semibold text-text-primary">{contact.phone}</p>
              </div>
            </div>
          )}

          {contact.company && (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 transition-colors">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-violet-500/15">
                <Building2 size={13} className="text-violet-500" />
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider mb-0.5">Company</p>
                <p className="text-[13px] font-semibold text-text-primary">{contact.company}</p>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="mt-6 pt-5 border-t border-border-divider">
          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-2 mb-3">Recent Activity</p>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-black/4 dark:hover:bg-white/4 transition-colors cursor-pointer group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/8">
              <Clock size={13} className="text-text-tertiary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary truncate">Last email: 2 days ago</p>
              <p className="text-[11px] text-text-tertiary truncate">Re: Invoice #0042</p>
            </div>
            <ChevronRight size={13} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ContactsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contact>(CONTACTS[0]);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 300);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="contacts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/20 dark:bg-black/50 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            key="contacts-panel"
            initial={{ opacity: 0, x: -20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed top-0 left-[60px] h-full z-[100] flex overflow-hidden"
            style={{
              width: 640,
              background: "var(--bg-main)",
              borderRight: "2px solid var(--border-divider)",
              boxShadow: "4px 0 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* Left: Contact List */}
            <div
              className="w-[240px] shrink-0 flex flex-col h-full"
              style={{ borderRight: "1px solid var(--border-divider)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-5 pb-3">
                <div className="flex items-center gap-2">
                  <UserCircle2 size={16} className="text-text-secondary" />
                  <h2 className="text-[14px] font-bold text-text-primary tracking-tight">Contacts</h2>
                  <span
                    className="text-[10px] font-bold text-text-tertiary px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--bg-surface-hover)" }}
                  >
                    {CONTACTS.length}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    title="New Contact"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    style={{ hover: { background: "var(--bg-surface-hover)" } } as any}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={onClose}
                    title="Close"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="px-3 pb-3">
                <div className="relative flex items-center">
                  <Search size={12} className="absolute left-2.5 text-text-tertiary pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search contacts…"
                    className="w-full h-[30px] pl-7 pr-3 rounded-lg text-[12px] text-text-primary placeholder:text-text-tertiary border-none outline-none font-medium transition-colors"
                    style={{ background: "var(--bg-surface-hover)" }}
                  />
                </div>
              </div>

              {/* Label */}
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-5 mb-1.5">
                My Contacts
              </p>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                <div className="flex flex-col gap-0.5">
                  <AnimatePresence initial={false}>
                    {filtered.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                      >
                        <ContactRow
                          contact={c}
                          isSelected={selected?.id === c.id}
                          onClick={() => setSelected(c)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <p className="text-[12px] text-text-tertiary text-center mt-10">No contacts found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Detail */}
            <div className="flex-1 overflow-hidden" style={{ background: "var(--bg-panel)" }}>
              <AnimatePresence mode="wait">
                {selected ? (
                  <ContactDetail key={selected.id} contact={selected} />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-3"
                  >
                    <UserCircle2 size={40} className="text-text-tertiary opacity-30" />
                    <p className="text-[13px] font-medium text-text-tertiary">Select a contact</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
