"use client";

import React from 'react';
import { Mail } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  description: string;
  guests: string[];
  style?: string;
}

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({ currentDate, events, onDayClick, onEventClick }: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    days.push({
      dateStr: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}`,
      dayNum: prevMonthDays - i,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      dayNum: i,
      isCurrentMonth: true,
    });
  }

  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      dateStr: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      dayNum: i,
      isCurrentMonth: false,
    });
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-border-divider">
        {weekDays.map(day => (
          <div key={day} className="py-2.5 text-center text-xs uppercase font-bold text-text-primary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, idx) => {
          const dayEvents = events.filter(e => e.date === day.dateStr);
          const isToday = day.dateStr === todayStr;

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day.dateStr)}
              className={`
                border-r border-b border-border-divider p-1 flex flex-col gap-0.5 cursor-pointer
                hover:bg-bg-surface-hover transition-colors relative group
                ${!day.isCurrentMonth ? 'opacity-30' : ''}
              `}
            >
              <div className="flex justify-center mb-0.5 mt-0.5">
                <span className={`
                  text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium
                  ${isToday ? 'bg-blue-600 text-white' : 'text-text-primary group-hover:bg-bg-surface-active'}
                `}>
                  {day.dayNum}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-[2px] px-0.5">
                {dayEvents.map(event => {
                  const colorClass = event.style || 'bg-blue-600 text-white';
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className={`text-[9.5px] px-1.5 py-[3px] rounded-[3px] flex items-center gap-1 truncate cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                    >
                      <span className="font-semibold opacity-80 shrink-0">{event.time}</span>
                      <span className="font-medium truncate">{event.title}</span>
                      {event.guests && event.guests.length > 0 && (
                        <Mail size={8} className="opacity-60 shrink-0 ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
