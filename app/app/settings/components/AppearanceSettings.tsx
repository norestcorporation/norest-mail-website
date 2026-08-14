"use client";

import React, { useState } from 'react';
import { Moon, Sun, Monitor, Palette, LayoutTemplate } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function AppearanceSettings() {
    const [theme, setTheme] = useState('dark');
    const [sidebarStyle, setSidebarStyle] = useState('Grouped Categories (Default)');
    const [uiDensity, setUiDensity] = useState('Comfortable');

    return (
        <div className="flex flex-col gap-8">

            {/* Theme Selection */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Theme Mode</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Light Theme */}
                    <div
                        onClick={() => setTheme('light')}
                        className={`bg-[#000] rounded-xl p-5 cursor-pointer transition-all ${theme === 'light' ? 'border-2 border-blue-700' : 'border border-[#fff]/5 hover:border-[#fff]/20'}`}
                    >
                        <div className="w-full h-24 bg-[#E5E5E5] rounded-lg mb-4 flex overflow-hidden">
                            <div className="w-1/4 h-full bg-[#D4D4D4]"></div>
                            <div className="w-3/4 h-full bg-white flex flex-col gap-2 p-2">
                                <div className="w-full h-4 bg-[#F5F5F5] rounded"></div>
                                <div className="w-2/3 h-4 bg-[#F5F5F5] rounded"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                Light
                            </h3>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-blue-700' : 'border-[#fff]/10'}`}>
                                {theme === 'light' && <div className="w-2 h-2 rounded-full bg-blue-700"></div>}
                            </div>
                        </div>
                    </div>

                    {/* Dark Theme */}
                    <div
                        onClick={() => setTheme('dark')}
                        className={`bg-[#000] rounded-xl p-5 cursor-pointer transition-all ${theme === 'dark' ? 'border-2 border-blue-700' : 'border border-[#fff]/5 hover:border-[#fff]/20'}`}
                    >
                        <div className="w-full h-24 bg-[#111] rounded-lg mb-4 flex overflow-hidden border border-[#fff]/5">
                            <div className="w-1/4 h-full bg-[#1A1A1A]"></div>
                            <div className="w-3/4 h-full bg-[#0A0A0A] flex flex-col gap-2 p-2">
                                <div className="w-full h-4 bg-[#111] rounded"></div>
                                <div className="w-2/3 h-4 bg-[#111] rounded"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                Dark (Current)
                            </h3>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-blue-700' : 'border-[#fff]/10'}`}>
                                {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-blue-700"></div>}
                            </div>
                        </div>
                    </div>

                    {/* System Theme */}
                    <div
                        onClick={() => setTheme('system')}
                        className={`bg-[#000] rounded-xl p-5 cursor-pointer transition-all ${theme === 'system' ? 'border-2 border-blue-700' : 'border border-[#fff]/5 hover:border-[#fff]/20'}`}
                    >
                        <div className="w-full h-24 rounded-lg mb-4 overflow-hidden bg-[linear-gradient(to_bottom_right,#000_50%,#fff_50%)]">
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                System Default
                            </h3>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'system' ? 'border-blue-700' : 'border-[#fff]/10'}`}>
                                {theme === 'system' && <div className="w-2 h-2 rounded-full bg-blue-700"></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Accent Color</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <p className="text-[13px] text-text-tertiary mb-6">Choose a primary color for buttons, active states, and highlights.</p>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white ring-2 ring-white ring-offset-2 ring-offset-[#000] cursor-pointer"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 rounded-full bg-purple-600 cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 rounded-full bg-green-600 cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 rounded-full bg-red-600 cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer hover:scale-110 transition-transform"></div>
                        <div className="w-10 h-10 rounded-full bg-teal-500 cursor-pointer hover:scale-110 transition-transform"></div>
                    </div>
                </div>
            </div>

            {/* Layout Customization */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Interface Elements</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><LayoutTemplate size={14} /> Sidebar Style</label>
                            <CustomDropdown options={["Grouped Categories (Default)", "Flat List", "Icons Only (Collapsed)"]} value={sidebarStyle} onChange={setSidebarStyle} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Palette size={14} /> UI Density</label>
                            <CustomDropdown options={["Comfortable", "Compact"]} value={uiDensity} onChange={setUiDensity} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
