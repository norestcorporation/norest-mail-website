"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, Plus, Mail, Phone, Building2, Star,
  Edit3, Trash2, Archive, Clock, UserCircle2, ChevronRight,
  Check, Users, MoreHorizontal, MapPin, Globe, Menu
} from "lucide-react";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  location?: string;
  website?: string;
  notes?: string;
  starred?: boolean;
  online?: boolean;
  initials: string;
  lastEmail?: string;
  lastEmailSubject?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CONTACTS: Contact[] = [
  { id: "1", name: "Partners", email: "partners@digitalocean.com", company: "DigitalOcean", role: "Business Partner", location: "New York, USA", website: "digitalocean.com", initials: "PA", lastEmail: "2 days ago", lastEmailSubject: "Re: Infrastructure upgrade" },
  { id: "2", name: "Partners", email: "partners@spaceship.com", company: "Spaceship", role: "Business Partner", location: "San Francisco, USA", website: "spaceship.com", initials: "PA", lastEmail: "5 days ago", lastEmailSubject: "Domain renewal notice" },
  { id: "3", name: "Partners", email: "partners@vultr.com", company: "Vultr", role: "Business Partner", location: "Los Angeles, USA", website: "vultr.com", initials: "PA", lastEmail: "1 week ago", lastEmailSubject: "VPS pricing update" },
  { id: "4", name: "Ripun", email: "hello@theripun.com", phone: "+91 98765 43210", company: "Norest Corp", role: "Founder & CEO", location: "Guwahati, India", website: "theripun.com", notes: "Founder of Norest. Loves design & building products.", initials: "RC", starred: true, online: true, lastEmail: "Today", lastEmailSubject: "Product roadmap Q3" },
  { id: "5", name: "Ripunbasumatary10", email: "ripunbasumatary10@gmail.com", initials: "RB", online: true, lastEmail: "3 hours ago", lastEmailSubject: "Hey, quick question" },
  { id: "6", name: "Spaceship Support", email: "support@spaceship.com", phone: "+1 800 555 0199", company: "Spaceship", role: "Support Team", location: "San Francisco, USA", website: "spaceship.com", initials: "SS", lastEmail: "3 days ago", lastEmailSubject: "Your support ticket #4821" },
  { id: "7", name: "V Anaqvi", email: "v-anaqvi@digitalocean.com", company: "DigitalOcean", role: "Account Manager", location: "New York, USA", initials: "VA", lastEmail: "Yesterday", lastEmailSubject: "Account review scheduled" },
  { id: "8", name: "Veebodosa", email: "veebodosa@gmail.com", initials: "VE", lastEmail: "2 weeks ago", lastEmailSubject: "Hello from Veebodosa" },
];

// ─── Initials Avatar ─────────────────────────────────────────────────────────

function Avatar({ initials, online, size = 36 }: { initials: string; online?: boolean; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full bg-bg-surface-hover flex items-center justify-center font-semibold text-text-secondary select-none"
        style={{ fontSize: size * 0.33 }}
      >
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-[2px] ring-white dark:ring-[#0a0a0a]" />
      )}
    </div>
  );
}

// ─── Contact Row (flat, no rounding) ─────────────────────────────────────────

function ContactRow({ contact, isSelected, onClick }: { contact: Contact; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100 relative border-b border-border-divider last:border-0",
        isSelected
          ? "bg-bg-surface-hover"
          : "hover:bg-bg-surface-hover/50"
      )}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-text-primary" />
      )}
      <Avatar initials={contact.initials} online={contact.online} size={34} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-text-primary truncate leading-tight">{contact.name}</span>
          {contact.starred && <Star size={10} className="text-text-tertiary shrink-0 fill-text-tertiary opacity-60" />}
        </div>
        <span className="text-[11px] text-text-tertiary truncate block">{contact.email}</span>
      </div>
    </button>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, link, onCopy, copied }: {
  icon: React.ElementType;
  label: string;
  value: string;
  link?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-start py-3 border-b border-border-divider last:border-0 group">
      <span className="w-[120px] shrink-0 text-[11px] text-text-tertiary font-medium pt-0.5 flex items-center gap-1.5">
        <Icon size={12} className="shrink-0 opacity-70" />
        {label}
      </span>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {link ? (
          <button
            onClick={onCopy}
            className="text-[13px] text-text-primary hover:underline truncate text-left cursor-pointer"
          >
            {value}
          </button>
        ) : (
          <span className="text-[13px] text-text-primary truncate">{value}</span>
        )}
        {copied && (
          <span className="text-[10px] text-text-tertiary flex items-center gap-0.5 shrink-0">
            <Check size={10} />Copied
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Contact Detail ──────────────────────────────────────────────────────────

function ContactDetail({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      key={contact.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-border-divider shrink-0">
        <div className="flex items-center gap-3">
          <Avatar initials={contact.initials} online={contact.online} size={42} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-text-primary leading-tight">{contact.name}</h2>
              {contact.starred && <Star size={11} className="text-text-tertiary opacity-50 fill-text-tertiary" />}
            </div>
            {contact.role && <p className="text-[12px] text-text-tertiary mt-0.5">{contact.role}{contact.company ? ` · ${contact.company}` : ""}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: Mail, title: "Send Email" },
            { icon: Edit3, title: "Edit" },
            { icon: Archive, title: "Archive" },
            { icon: Trash2, title: "Delete" },
            { icon: MoreHorizontal, title: "More" },
          ].map(({ icon: Icon, title }) => (
            <button
              key={title}
              title={title}
              className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded transition-colors cursor-pointer"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* General section */}
        <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">General</p>
        <div className="mb-6">
          <InfoRow icon={Mail} label="Email" value={contact.email} link onCopy={copyEmail} copied={copied} />
          {contact.phone && <InfoRow icon={Phone} label="Phone" value={contact.phone} />}
          {contact.company && <InfoRow icon={Building2} label="Company" value={contact.company} />}
          {contact.location && <InfoRow icon={MapPin} label="Location" value={contact.location} />}
          {contact.website && <InfoRow icon={Globe} label="Website" value={contact.website} />}
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-3">Notes</p>
            <p className="text-[13px] text-text-secondary leading-relaxed">{contact.notes}</p>
          </div>
        )}

        {/* Activity */}
        {contact.lastEmail && (
          <div>
            <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest mb-3">Recent Activity</p>
            <div className="flex items-center gap-3 py-2 group cursor-pointer">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Clock size={14} className="text-text-tertiary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-text-primary truncate">Last email: <span className="text-text-secondary">{contact.lastEmail}</span></p>
                {contact.lastEmailSubject && (
                  <p className="text-[11px] text-text-tertiary truncate mt-0.5">{contact.lastEmailSubject}</p>
                )}
              </div>
              <ChevronRight size={13} className="text-text-tertiary opacity-0 group-hover:opacity-60 transition-opacity" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full gap-3 text-center"
    >
      <UserCircle2 size={36} className="text-text-tertiary opacity-20" />
      <p className="text-[13px] text-text-tertiary">Select a contact to view details</p>
    </motion.div>
  );
}

// ─── Add Contact Modal ────────────────────────────────────────────────────────

function AddContactModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Contact) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !email) return;
    const initials = name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
    onAdd({ id: Math.random().toString(36).slice(2), name, email, company: company || undefined, phone: phone || undefined, initials });
    onClose();
  };

  const fields = [
    { label: "Full Name *", value: name, onChange: setName, placeholder: "John Doe" },
    { label: "Email *", value: email, onChange: setEmail, placeholder: "john@example.com" },
    { label: "Company", value: company, onChange: setCompany, placeholder: "Acme Inc." },
    { label: "Phone", value: phone, onChange: setPhone, placeholder: "+1 000 000 0000" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, y: 6 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 6 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-main border border-border-divider rounded-lg shadow-2xl w-full max-w-[380px] mx-4 p-5"
      >
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">New Contact</h3>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="block text-[11px] text-text-tertiary mb-1">{f.label}</label>
              <input
                type="text"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded bg-bg-surface-hover text-[13px] text-text-primary placeholder:text-text-tertiary outline-none border border-border-divider focus:border-text-tertiary/30 transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2 text-[13px] text-text-secondary border border-border-divider rounded hover:bg-bg-surface-hover transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name || !email}
            className="flex-1 py-2 text-[13px] font-semibold bg-text-primary text-bg-main rounded hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-30"
          >
            Add Contact
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Contact | null>(CONTACTS[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      (c.company?.toLowerCase().includes(query.toLowerCase()))
  );

  // Alpha grouping
  const grouped: Record<string, Contact[]> = {};
  filtered.forEach((c) => {
    const key = c.name[0].toUpperCase();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });
  const sortedKeys = Object.keys(grouped).sort();

  const handleAdd = (c: Contact) => {
    setContacts((prev) => [...prev, c]);
    setSelected(c);
    showToast(`${c.name} added`);
  };

  return (
    <div className="flex flex-col flex-1 h-screen bg-bg-main text-text-primary overflow-hidden relative transition-colors">

      {/* ── Header ── */}
      <div className="h-[52px] flex items-center justify-between px-5 border-b border-border-divider shrink-0 bg-bg-main">
        <div className="flex items-center gap-2.5">
          <button className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded transition-colors">
            <Menu size={17} />
          </button>
          <span className="text-[15px] font-semibold text-text-primary">Norest Contacts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-[200px] h-[30px] pl-7 pr-3 bg-bg-surface-hover text-[12px] text-text-primary placeholder:text-text-tertiary outline-none border border-border-divider rounded transition-colors focus:border-text-tertiary/30"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 h-[30px] bg-text-primary text-bg-main text-[12px] font-medium rounded hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={13} />
            New Contact
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar / Contact List ── */}
        <div className="w-[260px] shrink-0 flex flex-col border-r border-border-divider bg-bg-main">

          {/* List toolbar */}
          <div className="flex items-center justify-between px-4 h-10 border-b border-border-divider">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-text-tertiary" />
              <span className="text-[11px] font-semibold text-text-tertiary">My Contacts</span>
              <span className="text-[10px] text-text-tertiary opacity-60">({filtered.length})</span>
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 gap-2">
                <UserCircle2 size={28} className="text-text-tertiary opacity-20" />
                <p className="text-[12px] text-text-tertiary">No contacts found</p>
              </div>
            ) : (
              <div>
                {sortedKeys.map((letter) => (
                  <div key={letter}>
                    <div className="px-4 py-1.5 border-b border-border-divider bg-bg-main sticky top-0 z-10">
                      <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-widest">{letter}</span>
                    </div>
                    {grouped[letter].map((c) => (
                      <ContactRow
                        key={c.id}
                        contact={c}
                        isSelected={selected?.id === c.id}
                        onClick={() => setSelected(c)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Detail Panel ── */}
        <div className="flex-1 bg-bg-panel overflow-hidden">
          <AnimatePresence mode="wait">
            {selected ? (
              <ContactDetail key={selected.id} contact={selected} />
            ) : (
              <EmptyState key="empty" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals & Toasts ── */}
      <AnimatePresence>
        {showAddModal && (
          <AddContactModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-bg-surface border border-border-divider text-text-primary px-4 py-2.5 rounded shadow-xl flex items-center gap-2 z-50 whitespace-nowrap"
          >
            <Check size={12} className="text-text-secondary" />
            <span className="text-[12px] font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
