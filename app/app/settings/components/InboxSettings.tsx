"use client";

import React, { useState } from 'react';
import { Columns, AlignLeft, Layers, Filter, Maximize, MousePointerClick, Smartphone } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function InboxSettings() {
    const [conversationView, setConversationView] = useState(true);
    const [priorityInbox, setPriorityInbox] = useState(false);
    const [focusedInbox, setFocusedInbox] = useState(true);
    const [previewPane, setPreviewPane] = useState("Right of list (Split View)");
    const [listDensity, setListDensity] = useState("Comfortable (More spacing)");
    const [autoMarkRead, setAutoMarkRead] = useState("Immediately");
    const [swipeRight, setSwipeRight] = useState("Archive");
    const [swipeLeft, setSwipeLeft] = useState("Delete");

    return (
        <div className="flex flex-col gap-8">

            {/* View Style */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">View Style</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Layers size={16} className="text-text-secondary" />
                                Conversation View
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Group emails of the same topic together as a thread.</p>
                        </div>
                        <div onClick={() => setConversationView(!conversationView)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${conversationView ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${conversationView ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Filter size={16} className="text-text-secondary" />
                                Focused Inbox
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Separate important emails into a "Focused" tab, and others into "Other".</p>
                        </div>
                        <div onClick={() => setFocusedInbox(!focusedInbox)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${focusedInbox ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${focusedInbox ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white">Priority Inbox</h3>
                            <p className="text-[12px] text-text-tertiary">Automatically float important emails to the top of the inbox.</p>
                        </div>
                        <div onClick={() => setPriorityInbox(!priorityInbox)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${priorityInbox ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${priorityInbox ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout & Density */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Layout & Density</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-8 pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Columns size={14} /> Preview Pane
                            </label>
                            <CustomDropdown options={["Right of list (Split View)", "Below list", "No split (Full width list)"]} value={previewPane} onChange={setPreviewPane} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <AlignLeft size={14} /> List Density
                            </label>
                            <CustomDropdown options={["Comfortable (More spacing)", "Cozy", "Compact (Maximum emails visible)"]} value={listDensity} onChange={setListDensity} />
                        </div>
                    </div>

                    {/* Auto Mark Read */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <MousePointerClick size={16} className="text-text-secondary" />
                                Auto Mark as Read
                            </h3>
                            <p className="text-[13px] text-text-tertiary">When viewing an email in the preview pane, mark it as read:</p>
                        </div>
                        <div className="w-48">
                            <CustomDropdown options={["Immediately", "After 1 second", "After 3 seconds", "Never"]} value={autoMarkRead} onChange={setAutoMarkRead} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactions */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Swipe Actions (Mobile & Trackpad)</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Smartphone size={14} /> Swipe Right
                            </label>
                            <CustomDropdown options={["Archive", "Delete", "Mark as Read/Unread", "Move to Folder", "None"]} value={swipeRight} onChange={setSwipeRight} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Smartphone size={14} /> Swipe Left
                            </label>
                            <CustomDropdown options={["Delete", "Archive", "Mark as Read/Unread", "Move to Folder", "None"]} value={swipeLeft} onChange={setSwipeLeft} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
