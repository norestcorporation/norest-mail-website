"use client";

import React, { useState } from 'react';
import { Type, Eye, Keyboard, MousePointerClick, Zap } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function AccessibilitySettings() {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [screenReader, setScreenReader] = useState(false);
    const [fontSize, setFontSize] = useState("Default (Medium)");

    return (
        <div className="flex flex-col gap-8">

            {/* Visual Adjustments */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Visual Adjustments</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-8 pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Type size={14} /> Global UI Font Size
                            </label>
                            <CustomDropdown options={["Default (Medium)", "Large", "Extra Large"]} value={fontSize} onChange={setFontSize} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Eye size={14} /> Interface Contrast
                            </label>
                            <div className="flex items-center justify-between h-full bg-[#fff]/5 border border-[#fff]/5 px-4 rounded-lg">
                                <span className="text-[13px] text-text-secondary">High Contrast Mode</span>
                                <div
                                    onClick={() => setHighContrast(!highContrast)}
                                    className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${highContrast ? 'bg-blue-600' : 'bg-[#333]'}`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${highContrast ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Zap size={16} className="text-text-secondary" />
                                Reduce Motion
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Minimize animations, transitions, and hover effects across the app.</p>
                        </div>
                        <div
                            onClick={() => setReduceMotion(!reduceMotion)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${reduceMotion ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${reduceMotion ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input & Navigation */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Input & Navigation</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Keyboard size={16} className="text-text-secondary" />
                                Keyboard Navigation
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Enable advanced keyboard shortcuts (e.g. 'c' to compose, 'j/k' to navigate).</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative bg-blue-600`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] translate-x-5`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Eye size={16} className="text-text-secondary" />
                                Screen Reader Support
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Optimize the DOM for screen readers (adds extra ARIA labels and hides decorative icons).</p>
                        </div>
                        <div
                            onClick={() => setScreenReader(!screenReader)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${screenReader ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${screenReader ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <MousePointerClick size={16} className="text-text-secondary" />
                                Custom Cursor
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Use a larger, higher-contrast cursor while hovering over the app.</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative bg-[#333]`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] translate-x-1`}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
