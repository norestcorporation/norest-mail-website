"use client";

import { SettingsSection } from "./SettingsSection";
import { useState } from "react";
import clsx from "clsx";

export function InterfaceThemeSection() {
  const [theme, setTheme] = useState("system");

  const themes = [
    { id: "system", label: "System preference" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" }
  ];

  return (
    <SettingsSection title="Interface theme" description="Select or customize your UI theme.">
      <div className="flex flex-wrap gap-5">
        {themes.map((t) => (
          <div key={t.id} className="flex flex-col gap-3">
            <button
              onClick={() => setTheme(t.id)}
              className={clsx(
                "w-[200px] h-[130px] rounded-2xl border-2 overflow-hidden relative transition-all duration-200 p-[2px]",
                theme === t.id ? "border-text-primary" : "border-transparent hover:border-border-divider",
                "bg-bg-surface-hover/50"
              )}
            >
              {/* Mockup visual for theme */}
              <div className={clsx("w-full h-full rounded-xl flex flex-col overflow-hidden border border-border-divider/50",
                t.id === 'light' ? 'bg-[#f8f9fa]' : 'bg-[#151515]'
              )}>
                {/* Fake browser header */}
                <div className="flex items-center gap-1.5 p-3 border-b border-border-divider/50">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                  <div className={clsx("ml-4 h-[10px] w-24 rounded-full", t.id === 'light' ? 'bg-black/10' : 'bg-white/10')}></div>
                </div>
                {/* Fake body */}
                <div className="flex flex-1 p-3 gap-2">
                  <div className={clsx("w-1/4 rounded-lg", t.id === 'light' ? 'bg-black/5' : 'bg-white/5')}>
                    <div className="flex flex-col gap-2 mt-2 px-1">
                      <div className={clsx("h-1.5 w-full rounded-sm", t.id === 'light' ? 'bg-black/10' : 'bg-white/10')}></div>
                      <div className={clsx("h-1.5 w-3/4 rounded-sm", t.id === 'light' ? 'bg-black/10' : 'bg-white/10')}></div>
                      <div className={clsx("h-1.5 w-5/6 rounded-sm", t.id === 'light' ? 'bg-black/10' : 'bg-white/10')}></div>
                    </div>
                  </div>
                  <div className={clsx("flex-1 rounded-lg", t.id === 'light' ? 'bg-white border border-black/5' : 'bg-[#222] border border-white/5')}>
                    <div className={clsx("h-2 w-1/3 rounded-sm mt-3 ml-3", t.id === 'light' ? 'bg-black/10' : 'bg-white/10')}></div>
                    <div className={clsx("h-10 w-auto mx-3 mt-3 rounded", t.id === 'light' ? 'bg-black/5' : 'bg-[#1a1a1a]')}></div>
                  </div>
                </div>
              </div>
            </button>
            <span className="text-[14px] font-medium text-text-primary">{t.label}</span>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
