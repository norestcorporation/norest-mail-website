"use client";

import React from 'react';
import { MoreVertical, MoreHorizontal } from 'lucide-react';

const TASKS = [
  {
    id: 1,
    title: "Spline animated logo",
    subtitle: "🌽 Logo",
    startCol: 2,
    span: 7,
    row: 1,
    style: "bg-[#222] border border-[#333]",
    leftGlow: "bg-indigo-500",
    avatars: [1, 2],
  },
  {
    id: 2,
    title: "New microdose website",
    subtitle: "🍃 New Homepage",
    startCol: 8,
    span: 12,
    row: 3,
    style: "bg-gradient-to-r from-indigo-500 via-pink-400 to-orange-300",
    hasLeftHandle: true,
    hasRightHandle: true,
    avatars: [1, 2, 3],
  },
  {
    id: 3,
    title: "Case studies",
    subtitle: "🍄 Fin Tech work",
    startCol: 21,
    span: 5,
    row: 1,
    style: "bg-[#222] border border-[#333]",
    leftGlow: "bg-orange-500",
    avatars: [],
  },
  {
    id: 4,
    title: "Input Styleguide",
    subtitle: "🎤 Contact",
    startCol: 2,
    span: 9,
    row: 5,
    style: "bg-[#222] border border-[#333]",
    leftGlow: "bg-green-500",
    avatars: [3, 4, 1],
  },
  {
    id: 5,
    title: "Sales deck - iteration ver. 1",
    subtitle: "🍃 Marketing",
    startCol: 11,
    span: 11,
    row: 7,
    style: "bg-[#222] border border-[#333]",
    leftGlow: "bg-indigo-500",
    avatars: [2, 3, 4],
  },
  {
    id: 6,
    title: "Demo reel",
    subtitle: "🏄 Animation 2nd",
    startCol: 13,
    span: 8,
    row: 9,
    style: "bg-[#222] border border-[#333]",
    leftGlow: "bg-pink-500",
    avatars: [],
  }
];

// Helper to generate the day columns
const DAYS = [
  { m: 'M', d: '23' }, { m: 'T', d: '24' }, { m: 'W', d: '25' }, { m: 'T', d: '26', today: true },
  { m: 'F', d: '27' }, { m: 'S', d: '28' }, { m: 'S', d: '29' }, { m: 'M', d: '30' },
  { m: 'T', d: '31' }, { m: 'W', d: '1', month: 'Jan' }, { m: 'T', d: '2' }, { m: 'F', d: '3' },
  { m: 'S', d: '4' }, { m: 'S', d: '5' }, { m: 'M', d: '6' }, { m: 'T', d: '7' },
  { m: 'W', d: '8' }, { m: 'T', d: '9' }, { m: 'F', d: '10' }, { m: 'S', d: '11' },
  { m: 'S', d: '12' }, { m: 'M', d: '13' }, { m: 'T', d: '14' }, { m: 'W', d: '15' }
];

export function TimelineGrid({ viewMode }: { viewMode: string }) {
  // Constants for sizing
  const COL_WIDTH = 56;
  const ROW_HEIGHT = 48;
  const HEADER_HEIGHT = 60;

  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto no-scrollbar pb-10 relative">
      <div
        className="relative"
        style={{ width: DAYS.length * COL_WIDTH, minHeight: '100%' }}
      >
        {/* Months Header */}
        <div className="flex absolute top-0 left-0 w-full text-[13px] font-bold text-white z-10" style={{ height: 30 }}>
          <div className="absolute left-0">December 2024</div>
          <div className="absolute" style={{ left: 9 * COL_WIDTH }}>January 2025</div>
          <div className="absolute text-[#555]" style={{ left: 24 * COL_WIDTH }}>Feb '25</div>
        </div>

        {/* Days Header */}
        <div className="flex absolute left-0 w-full text-[12px] text-[#888] font-medium z-10 border-b border-[#222]" style={{ top: 30, height: 30 }}>
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center gap-1"
              style={{ left: i * COL_WIDTH, width: COL_WIDTH, height: 30 }}
            >
              <span>{day.m}</span>
              <span className={day.today ? "text-white font-bold" : ""}>{day.d}</span>
            </div>
          ))}
        </div>

        {/* Grid Lines */}
        <div className="absolute left-0 w-full bottom-0" style={{ top: HEADER_HEIGHT }}>
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-[#222]"
              style={{ left: i * COL_WIDTH, width: COL_WIDTH }}
            >
              {/* Optional: subtle background pattern for weekends */}
              {(day.m === 'S') && (
                <div className="w-full h-full bg-[#1A1A1A] opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 10px)' }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Today Indicator Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: 3 * COL_WIDTH + COL_WIDTH / 2, width: 2, background: 'linear-gradient(to bottom, #7C3AED, rgba(124, 58, 237, 0.2))' }}
        >
          <div className="w-6 h-1.5 bg-[#7C3AED] rounded-full absolute -top-[1.5px] -left-[11px]" />
        </div>

        {/* Connection SVG Lines */}
        <svg className="absolute left-0 w-full h-full pointer-events-none z-10" style={{ top: HEADER_HEIGHT }}>
          {/* Logo to Microdose */}
          <path d={`M ${9 * COL_WIDTH} ${1 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${9 * COL_WIDTH + 15} ${1 * ROW_HEIGHT + ROW_HEIGHT / 2} Q ${9 * COL_WIDTH + 25} ${1 * ROW_HEIGHT + ROW_HEIGHT / 2} ${9 * COL_WIDTH + 25} ${1 * ROW_HEIGHT + ROW_HEIGHT / 2 + 10} L ${9 * COL_WIDTH + 25} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2 - 10} Q ${9 * COL_WIDTH + 25} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2} ${9 * COL_WIDTH + 35} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${10 * COL_WIDTH - 10} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2}`} fill="none" stroke="#444" strokeWidth="1.5" />
          <circle cx={9 * COL_WIDTH + 15} cy={1 * ROW_HEIGHT + ROW_HEIGHT / 2} r="4" fill="#7C3AED" />
          <path d={`M ${10 * COL_WIDTH - 15} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2 - 4} L ${10 * COL_WIDTH - 10} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${10 * COL_WIDTH - 15} ${3 * ROW_HEIGHT + ROW_HEIGHT / 2 + 4}`} fill="none" stroke="#444" strokeWidth="1.5" />

          {/* Styleguide to Demo Reel */}
          <path d={`M ${6 * COL_WIDTH} ${5 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${6 * COL_WIDTH + 10} ${5 * ROW_HEIGHT + ROW_HEIGHT / 2} Q ${6 * COL_WIDTH + 20} ${5 * ROW_HEIGHT + ROW_HEIGHT / 2} ${6 * COL_WIDTH + 20} ${5 * ROW_HEIGHT + ROW_HEIGHT / 2 + 10} L ${6 * COL_WIDTH + 20} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2 - 10} Q ${6 * COL_WIDTH + 20} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2} ${6 * COL_WIDTH + 30} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${12 * COL_WIDTH - 10} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2}`} fill="none" stroke="#444" strokeWidth="1.5" />
          <circle cx={6 * COL_WIDTH + 10} cy={5 * ROW_HEIGHT + ROW_HEIGHT / 2} r="4" fill="#10B981" />

          <path d={`M ${12 * COL_WIDTH - 15} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2 - 4} L ${12 * COL_WIDTH - 10} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2} L ${12 * COL_WIDTH - 15} ${9 * ROW_HEIGHT + ROW_HEIGHT / 2 + 4}`} fill="none" stroke="#444" strokeWidth="1.5" />
        </svg>

        {/* Tasks */}
        <div className="absolute left-0 w-full z-20" style={{ top: HEADER_HEIGHT }}>
          {TASKS.map(task => (
            <div
              key={task.id}
              className={`absolute rounded-xl flex items-center px-4 cursor-pointer shadow-lg transition-transform hover:scale-[1.02] ${task.style}`}
              style={{
                left: task.startCol * COL_WIDTH,
                width: task.span * COL_WIDTH - 10,
                top: task.row * ROW_HEIGHT,
                height: ROW_HEIGHT - 6
              }}
            >
              {task.leftGlow && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-md ${task.leftGlow}`}></div>
              )}
              {task.hasLeftHandle && (
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full"></div>
              )}
              {task.hasRightHandle && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full"></div>
              )}

              <div className="flex flex-col justify-center overflow-hidden">
                <span className={`text-[13px] font-semibold truncate ${task.style.includes('gradient') ? 'text-white' : 'text-[#EFEFEF]'}`}>{task.title}</span>
                <span className={`text-[11px] truncate ${task.style.includes('gradient') ? 'text-white/80' : 'text-[#888]'}`}>{task.subtitle}</span>
              </div>

              <div className="ml-auto flex items-center gap-2 pl-2">
                {task.avatars.length > 0 && (
                  <div className="flex -space-x-1.5">
                    {task.avatars.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={`https://i.pravatar.cc/150?u=${avatar + 10}`}
                        className="w-5 h-5 rounded-full border border-[#222]"
                      />
                    ))}
                  </div>
                )}
                <button className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${task.style.includes('gradient') ? 'text-white/80 hover:bg-white/20' : 'text-[#888] hover:bg-[#333]'}`}>
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
