"use client";

import React, { useState } from 'react';
import { Calendar, Globe, Users, Type, MessageSquare, Bold, Italic, Underline, Link2 } from 'lucide-react';

export function AutoReplySettings() {
    const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
    const [internalReplyEnabled, setInternalReplyEnabled] = useState(true);
    const [externalReplyEnabled, setExternalReplyEnabled] = useState(false);

    return (
        <div className="flex flex-col gap-8">

            {/* Master Toggle */}
            <div className="bg-[#000] rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                            Vacation Responder
                        </h3>
                        <p className="text-[13px] font-medium text-white/60">Automatically reply to incoming messages when you're away.</p>
                    </div>
                    <div
                        onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                        className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${autoReplyEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoReplyEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                </div>
            </div>

            {/* Configuration */}
            <div className={`flex flex-col gap-8 transition-opacity ${!autoReplyEnabled ? 'opacity-50 pointer-events-none' : ''}`}>

                {/* Notice */}
                <div className="bg-blue-700 text-white font-medium text-[14px] p-4 rounded-xl">
                    While enabled, automated responses will be sent to all incoming messages until this setting is disabled.
                </div>

                {/* Audience */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-text-primary">Audience</h2>
                    <div className="bg-[#000] rounded-xl p-2">
                        <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                    <Users size={16} className="text-text-secondary" />
                                    Internal Reply
                                </h3>
                                <p className="text-[12px] text-text-tertiary">Send replies to people within your organization (theripun.com).</p>
                            </div>
                            <div
                                onClick={() => setInternalReplyEnabled(!internalReplyEnabled)}
                                className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${internalReplyEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                            >
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${internalReplyEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                    <Globe size={16} className="text-text-secondary" />
                                    External Reply
                                </h3>
                                <p className="text-[12px] font-medium text-text-tertiary">Send replies to people outside your organization.</p>
                            </div>
                            <div
                                onClick={() => setExternalReplyEnabled(!externalReplyEnabled)}
                                className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${externalReplyEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                            >
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${externalReplyEnabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-6">
                    <div className={`flex flex-col gap-4 transition-opacity ${!internalReplyEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h2 className="text-lg font-semibold text-text-primary">Internal Message</h2>
                        <div className="bg-[#000] rounded-xl flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-[#222]">
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    defaultValue="Out of Office"
                                    className="w-full bg-transparent text-white text-[15px] font-semibold outline-none"
                                />
                            </div>
                            {/* Editor Toolbar (Mock) */}
                            <div className="flex items-center gap-1 p-2 bg-[#111] border-b border-[#222]">
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Type size={14} /></button>
                                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Bold size={14} /></button>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Italic size={14} /></button>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Underline size={14} /></button>
                                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Link2 size={14} /></button>
                            </div>
                            {/* Editor Body */}
                            <div className="p-4 h-48">
                                <textarea
                                    className="w-full h-full bg-transparent text-[14px] text-white outline-none resize-none"
                                    placeholder="Write your vacation auto-reply here..."
                                    defaultValue={"Hi team,\n\nI am currently out of the office and will not be checking email until I return. If this is urgent, please contact support@theripun.com.\n\nBest,\nRipun"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-4 transition-opacity ${!externalReplyEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h2 className="text-lg font-semibold text-text-primary">External Message</h2>
                        <div className="bg-[#000] rounded-xl flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-[#222]">
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    defaultValue="Out of Office"
                                    className="w-full bg-transparent text-white text-[15px] font-semibold outline-none"
                                />
                            </div>
                            {/* Editor Toolbar (Mock) */}
                            <div className="flex items-center gap-1 p-2 bg-[#111] border-b border-[#222]">
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Type size={14} /></button>
                                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Bold size={14} /></button>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Italic size={14} /></button>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Underline size={14} /></button>
                                <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                                <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Link2 size={14} /></button>
                            </div>
                            {/* Editor Body */}
                            <div className="p-4 h-48">
                                <textarea
                                    className="w-full h-full bg-transparent text-[14px] text-white outline-none resize-none"
                                    placeholder="Write your vacation auto-reply here..."
                                    defaultValue={"Hi there,\n\nI am currently out of the office and will not be checking email until I return. If this is urgent, please contact support@theripun.com.\n\nBest,\nRipun"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
