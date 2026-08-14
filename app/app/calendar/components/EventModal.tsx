"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Calendar as CalendarIcon, Clock, Users, MessageSquare, MapPin, RotateCcw, ChevronDown } from 'lucide-react';
import { CalendarEvent } from './CalendarGrid';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>, sendEmail: boolean) => void;
  initialDate: string | null;
}

const EVENT_COLORS = [
  { label: 'Tomato', bg: '#EA4335', tw: 'bg-[#EA4335] text-white' },
  { label: 'Flamingo', bg: '#E67C73', tw: 'bg-[#E67C73] text-white' },
  { label: 'Tangerine', bg: '#F4511E', tw: 'bg-[#F4511E] text-white' },
  { label: 'Banana', bg: '#F6BF26', tw: 'bg-[#F6BF26] text-black' },
  { label: 'Sage', bg: '#33B679', tw: 'bg-[#33B679] text-white' },
  { label: 'Basil', bg: '#0F9D58', tw: 'bg-[#0F9D58] text-white' },
  { label: 'Peacock', bg: '#039BE5', tw: 'bg-[#039BE5] text-white' },
  { label: 'Blueberry', bg: '#3F51B5', tw: 'bg-[#3F51B5] text-white' },
  { label: 'Lavender', bg: '#7986CB', tw: 'bg-[#7986CB] text-white' },
  { label: 'Grape', bg: '#8E24AA', tw: 'bg-[#8E24AA] text-white' },
  { label: 'Graphite', bg: '#616161', tw: 'bg-[#616161] text-white' },
];

const EVENT_TYPES = [
  { label: 'Event', icon: CalendarIcon },
  { label: 'Out of office', icon: null },
  { label: 'Task', icon: null },
];

const REPEAT_OPTIONS = [
  'Does not repeat',
  'Daily',
  'Weekly',
  'Monthly',
  'Annually',
  'Custom…',
];

/* ─── FieldRow ─── Moved OUTSIDE to prevent remount on every render ─── */
function FieldRow({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-5 flex justify-center pt-2.5 shrink-0">
        <Icon size={17} className="text-text-tertiary" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/* ─── Custom Dropdown ─── Opens upward when near bottom, properly themed ─── */
function CustomDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      // Measure space below the button
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 220px below, open upward
      setOpenUp(spaceBelow < 220);
    }
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative w-full">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="bg-white/5 dark:bg-white/5 bg-black/[0.03] rounded-lg px-3 py-2.5 flex items-center w-full text-left group transition-colors hover:bg-black/[0.06] dark:hover:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <span className="flex-1 text-sm text-text-primary">{value}</span>
        <ChevronDown
          size={14}
          className={`text-text-tertiary shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 z-30 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden
            ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center gap-2
                ${value === option
                  ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-[#444] dark:text-[#ccc] hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                }`}
            >
              {value === option && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <path d="M2 6l3 3L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span className={value === option ? '' : 'ml-5'}>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Color Picker ─── */
function ColorPicker({ selected, onChange }: { selected: typeof EVENT_COLORS[0]; onChange: (c: typeof EVENT_COLORS[0]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 group"
        title="Choose event color"
      >
        <span className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-black/10 dark:ring-white/10 shadow-sm transition-transform group-hover:scale-105" style={{ background: selected.bg }}>
        </span>
        <ChevronDown size={13} className="text-text-tertiary group-hover:text-text-primary transition-colors mt-0.5" />
      </button>

      {open && (
        <div className="absolute top-11 left-0 z-20 w-[240px] bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary mb-2.5 px-1">Event color</p>
          <div className="grid grid-cols-4 gap-y-2 gap-x-1">
            {EVENT_COLORS.map(color => (
              <button
                key={color.label}
                type="button"
                onClick={() => { onChange(color); setOpen(false); }}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${selected.label === color.label ? 'bg-black/5 dark:bg-white/5' : ''}`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: color.bg }}
                >
                  {selected.label === color.label && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[9px] text-text-tertiary leading-tight text-center">{color.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Event Modal ─── */
export function EventModal({ isOpen, onClose, onSave, initialDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [repeat, setRepeat] = useState('Does not repeat');
  const [eventType, setEventType] = useState('Event');
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[6]); // Peacock blue

  // Refs for stable input access
  const titleRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      const d = initialDate || new Date().toISOString().split('T')[0];
      setDate(d);
      setEndDate(d);
      setTime('09:00');
      setEndTime('10:00');
      setDescription('');
      setLocation('');
      setGuests('');
      setSendEmail(true);
      setRepeat('Does not repeat');
      setEventType('Event');
      setSelectedColor(EVENT_COLORS[6]);
      // Auto-focus title after state reset
      requestAnimationFrame(() => {
        titleRef.current?.focus();
      });
    }
  }, [isOpen, initialDate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const guestList = guests.split(',').map(g => g.trim()).filter(g => g.length > 0);
    onSave({
      title: title || 'Untitled Event',
      date,
      time,
      description,
      guests: guestList,
      style: selectedColor.tw,
    }, sendEmail && guestList.length > 0);
    onClose();
  }, [title, date, time, description, guests, selectedColor, sendEmail, onSave, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[3px]">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black w-full max-w-[500px] max-h-[90vh] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.6)] border border-black/8 dark:border-white/8 flex flex-col"
      >
        {/* Header — fixed at top */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ColorPicker selected={selectedColor} onChange={setSelectedColor} />
            <input
              ref={titleRef}
              type="text"
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 min-w-0 border-b-2 border-black/10 dark:border-white/15 focus:border-blue-500 text-[22px] font-medium text-text-primary bg-transparent px-0 py-1 placeholder-text-tertiary focus:outline-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 p-1.5 text-text-tertiary hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Event Type Tabs — fixed */}
        <div className="flex gap-2 px-5 pb-4 shrink-0">
          {EVENT_TYPES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setEventType(label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded border transition-colors
                ${eventType === label
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-black/10 dark:border-white/10 text-text-tertiary hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              {Icon && <Icon size={13} />}
              {label}
            </button>
          ))}
        </div>

        {/* Past Date Notice — fixed */}
        {date && new Date(date) < new Date(new Date().toDateString()) && (
          <div className="mx-5 mb-4 flex items-center gap-2.5 bg-blue-700 text-white px-4 py-2.5 rounded-lg shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <circle cx="8" cy="8" r="7.5" stroke="white" strokeOpacity="0.6" />
              <path d="M8 5v4M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium">You&apos;re creating an event in the past. It will still be saved.</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-black/5 dark:bg-white/5 mx-5 mb-4 shrink-0" />

        {/* Scrollable Fields Area */}
        <div className="px-5 flex flex-col gap-3 pb-5 overflow-y-auto flex-1 min-h-0">

          {/* Guests */}
          <FieldRow icon={Users}>
            <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-500/30">
              <input
                type="text"
                placeholder="Invite participants or groups"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent w-full text-sm text-text-primary placeholder-text-tertiary focus:outline-none"
              />
            </div>
          </FieldRow>

          {/* Date / Time — using visible native inputs properly styled */}
          <FieldRow icon={CalendarIcon}>
            <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg overflow-hidden transition-colors">
              {/* Start row */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-black/5 dark:border-white/5">
                <span className="text-xs text-text-tertiary w-10 shrink-0">Start</span>
                <div className="relative flex items-center gap-1 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => startDateRef.current?.showPicker?.()}
                    className="text-sm text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {formatDate(date)}
                  </button>
                  <input
                    ref={startDateRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="sr-only"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => startDateRef.current?.showPicker?.()}
                    className="p-0.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <CalendarIcon size={14} />
                  </button>
                  <span className="text-black/15 dark:text-white/15 mx-1">|</span>
                  <button
                    type="button"
                    onClick={() => startTimeRef.current?.showPicker?.()}
                    className="text-sm text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {formatTime(time)}
                  </button>
                  <input
                    ref={startTimeRef}
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => startTimeRef.current?.showPicker?.()}
                    className="p-0.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Clock size={14} />
                  </button>
                </div>
              </div>
              {/* End row */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="text-xs text-text-tertiary w-10 shrink-0">End</span>
                <div className="relative flex items-center gap-1 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => endDateRef.current?.showPicker?.()}
                    className="text-sm text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {formatDate(endDate)}
                  </button>
                  <input
                    ref={endDateRef}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => endDateRef.current?.showPicker?.()}
                    className="p-0.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <CalendarIcon size={14} />
                  </button>
                  <span className="text-black/15 dark:text-white/15 mx-1">|</span>
                  <button
                    type="button"
                    onClick={() => endTimeRef.current?.showPicker?.()}
                    className="text-sm text-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {formatTime(endTime)}
                  </button>
                  <input
                    ref={endTimeRef}
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => endTimeRef.current?.showPicker?.()}
                    className="p-0.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Clock size={14} />
                  </button>
                </div>
              </div>
            </div>
          </FieldRow>

          {/* Repeat — Custom dropdown */}
          <FieldRow icon={RotateCcw}>
            <CustomDropdown
              value={repeat}
              options={REPEAT_OPTIONS}
              onChange={setRepeat}
            />
          </FieldRow>

          {/* Location */}
          <FieldRow icon={MapPin}>
            <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-500/30">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent w-full text-sm text-text-primary placeholder-text-tertiary focus:outline-none"
              />
            </div>
          </FieldRow>

          {/* Description */}
          <FieldRow icon={MessageSquare}>
            <div className="bg-black/[0.03] dark:bg-white/5 rounded-lg px-3 py-2.5 transition-colors focus-within:ring-2 focus-within:ring-blue-500/30">
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-transparent w-full text-sm text-text-primary placeholder-text-tertiary focus:outline-none resize-none"
              />
            </div>
          </FieldRow>

          {/* Send Email Toggle */}
          {guests.length > 0 && (
            <div className="flex items-center justify-between bg-black/[0.03] dark:bg-white/5 rounded-lg px-3 py-2.5 transition-colors">
              <span className="text-sm text-text-secondary">Send email invitations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
                <div className="w-9 h-5 bg-black/10 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 after:shadow-sm"></div>
              </label>
            </div>
          )}

          {/* Extra padding at bottom so dropdown has room */}
          <div className="h-4 shrink-0" />
        </div>

        {/* Footer — fixed at bottom */}
        <div className="flex items-center gap-4 px-5 py-4 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-sm shrink-0">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            More options
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-sm text-text-tertiary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
