"use client";

import { SettingsSection } from "./SettingsSection";
import { useState } from "react";
import clsx from "clsx";

export function TablesViewSection() {
  const [view, setView] = useState("compact");

  const views = [
    { id: "default", label: "Default" },
    { id: "compact", label: "Compact" },
    { id: "spacious", label: "Spacious" }
  ];

  const getRowSpacing = (id: string) => {
    if (id === 'compact') return 'gap-1';
    if (id === 'spacious') return 'gap-3';
    return 'gap-2';
  };

  return (
    <SettingsSection title="Tables view" description="How are tables displayed in the app.">
      <div className="flex flex-wrap gap-5">
        {views.map((v) => (
          <div key={v.id} className="flex flex-col gap-3">
            <button
              onClick={() => setView(v.id)}
              className={clsx(
                "w-[200px] h-[130px] rounded-2xl border-2 overflow-hidden relative transition-all duration-200 p-[2px]",
                view === v.id ? "border-text-primary" : "border-transparent hover:border-border-divider",
                "bg-bg-surface-hover/50"
              )}
            >
              {/* Mockup visual for table */}
              <div className="w-full h-full rounded-xl flex flex-col overflow-hidden bg-[#151515] border border-border-divider/50 p-3">
                <div className="h-2 w-16 bg-white/20 rounded-full mb-3"></div>
                <div className={clsx("flex flex-col", getRowSpacing(v.id))}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/20 shrink-0"></div>
                      <div className="flex-1 flex gap-2">
                        <div className="h-1.5 w-1/4 bg-white/10 rounded-sm"></div>
                        <div className="h-1.5 w-1/4 bg-white/10 rounded-sm"></div>
                        <div className="h-1.5 w-1/4 bg-white/10 rounded-sm"></div>
                        <div className="h-1.5 w-1/4 bg-white/10 rounded-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </button>
            <span className="text-[14px] font-medium text-text-primary">{v.label}</span>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
