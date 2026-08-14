"use client";

import React, { useState } from 'react';
import { Search, ChevronRight, ChevronLeft, Plus, Check, Bell, Menu } from 'lucide-react';
import { CalendarGrid, CalendarEvent } from './components/CalendarGrid';
import { EventModal } from './components/EventModal';

// Color palette for new calendars
const CALENDAR_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500',
  'bg-violet-600', 'bg-cyan-600', 'bg-orange-600', 'bg-pink-600',
];

interface CalendarCategory {
  id: string;
  name: string;
  color: string;
  checked: boolean;
}

// Functional mini-calendar
function MiniCalendar({
  currentDate,
  onMonthChange,
  onDayClick,
}: {
  currentDate: Date;
  onMonthChange: (d: Date) => void;
  onDayClick: (dateStr: string) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const monthStr = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm font-semibold text-text-primary">{monthStr} {year}</span>
        <div className="flex gap-0.5">
          <button
            onClick={() => onMonthChange(new Date(year, month - 1, 1))}
            className="p-1 text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => onMonthChange(new Date(year, month + 1, 1))}
            className="p-1 text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] text-text-tertiary font-medium py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          return (
            <div
              key={i}
              onClick={() => onDayClick(dateStr)}
              className={`text-xs w-7 h-7 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors
                ${isToday ? 'bg-blue-600 text-white font-semibold' : 'text-text-secondary hover:bg-bg-surface-hover'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [miniDate, setMiniDate] = useState(new Date());

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Design Review',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      description: 'Review the new calendar designs.',
      guests: ['design@ex.com'],
      style: 'bg-blue-600 text-white'
    },
    {
      id: '2',
      title: 'Team Sync',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      description: 'Weekly sync',
      guests: [],
      style: 'bg-emerald-600 text-white'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const [calendars, setCalendars] = useState<CalendarCategory[]>([
    { id: '1', name: 'Personal', color: 'bg-blue-600', checked: true },
    { id: '2', name: 'Work', color: 'bg-emerald-600', checked: true },
    { id: '3', name: 'Birthdays', color: 'bg-rose-600', checked: false },
  ]);
  const [addingCalendar, setAddingCalendar] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState('');

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleMiniDayClick = (dateStr: string) => {
    const d = new Date(dateStr);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (newEventData: Omit<CalendarEvent, 'id'>, sendEmail: boolean) => {
    const newEvent: CalendarEvent = {
      ...newEventData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents([...events, newEvent]);
    if (sendEmail && newEvent.guests.length > 0) {
      showToast(`Invites sent to ${newEvent.guests.length} guest(s) for "${newEvent.title}"`);
    } else {
      showToast(`"${newEvent.title}" saved`);
    }
  };

  const toggleCalendar = (id: string) =>
    setCalendars(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));

  const addCalendar = () => {
    if (!newCalendarName.trim()) return;
    const colorIdx = calendars.length % CALENDAR_COLORS.length;
    setCalendars(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      name: newCalendarName.trim(),
      color: CALENDAR_COLORS[colorIdx],
      checked: true,
    }]);
    setNewCalendarName('');
    setAddingCalendar(false);
  };

  const monthStr = currentDate.toLocaleString('default', { month: 'long' });
  const yearStr = currentDate.getFullYear();

  return (
    <div className="flex flex-col flex-1 h-screen bg-bg-main text-text-primary overflow-hidden relative transition-colors">

      {/* Header — uses same theme tokens as rest of the app */}
      <div className="h-[56px] flex items-center justify-between px-4 border-b border-border-divider shrink-0 bg-bg-main transition-colors">
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-bg-surface-hover transition-colors">
            <Menu size={20} />
          </button>
          <span className="text-xl font-medium text-text-primary tracking-tight">Norest Calendar</span>

          <div className="ml-8 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded-full transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover rounded-full transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
            <span className="text-xl font-normal text-text-primary">{monthStr} {yearStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-bg-surface-hover transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 text-text-tertiary hover:text-text-primary rounded-full hover:bg-bg-surface-hover transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">

        {/* Sidebar */}
        <div className="w-[220px] flex flex-col shrink-0 border-r border-border-divider p-4 gap-5 bg-bg-main overflow-y-auto transition-colors">

          <button
            onClick={() => { setSelectedDate(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-text-primary text-bg-main rounded-full font-medium text-sm hover:opacity-90 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            Create
          </button>

          <MiniCalendar
            currentDate={miniDate}
            onMonthChange={setMiniDate}
            onDayClick={handleMiniDayClick}
          />

          {/* My Calendars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">My calendars</span>
              <button
                onClick={() => setAddingCalendar(true)}
                className="p-0.5 text-text-tertiary hover:text-text-primary transition-colors"
                title="Add calendar"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {calendars.map(cal => (
                <label key={cal.id} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                  <div
                    onClick={() => toggleCalendar(cal.id)}
                    className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors
                      ${cal.checked ? `${cal.color} border-transparent` : 'border-border-divider bg-transparent'}
                    `}
                  >
                    {cal.checked && <Check size={9} className="text-white" />}
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{cal.name}</span>
                </label>
              ))}

              {addingCalendar && (
                <div className="mt-1 flex gap-1">
                  <input
                    autoFocus
                    type="text"
                    value={newCalendarName}
                    onChange={e => setNewCalendarName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addCalendar(); if (e.key === 'Escape') setAddingCalendar(false); }}
                    placeholder="Calendar name"
                    className="flex-1 bg-bg-surface border border-border-divider rounded px-2 py-1 text-xs text-text-primary placeholder-text-tertiary focus:outline-none"
                  />
                  <button onClick={addCalendar} className="text-[10px] text-white bg-blue-600 rounded px-2 hover:bg-blue-700">
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Calendar Grid */}
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onDayClick={handleDayClick}
          onEventClick={(event) => { console.log("Clicked event", event); }}
        />

      </div>

      {/* Create Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={selectedDate}
      />

      {/* Toast */}
      {toast.show && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-bg-surface border border-border-divider text-text-primary px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <Check size={12} />
          </div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
