"use client";

import React, { useState } from 'react';
import { EyeOff, Link2, Ghost, Database, BrainCircuit, Activity, ShieldCheck, Download } from 'lucide-react';

export function PrivacySettings() {
    const [blockImages, setBlockImages] = useState(true);
    const [pixelProtection, setPixelProtection] = useState(true);
    const [linkTracking, setLinkTracking] = useState(true);
    const [hideIp, setHideIp] = useState(true);
    const [anonymousReplies, setAnonymousReplies] = useState(false);
    const [aiDataUsage, setAiDataUsage] = useState(false);

    return (
        <div className="flex flex-col gap-8">

            {/* Email Protection */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Email Reading Protection</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <EyeOff size={16} className="text-text-secondary" />
                                Block Remote Images
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Prevent images from loading automatically to hide your IP address from senders.</p>
                        </div>
                        <div
                            onClick={() => setBlockImages(!blockImages)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${blockImages ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${blockImages ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <ShieldCheck size={16} className="text-text-secondary" />
                                Tracking Pixel Protection
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Identify and neutralize invisible tracking pixels in incoming marketing emails.</p>
                        </div>
                        <div
                            onClick={() => setPixelProtection(!pixelProtection)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${pixelProtection ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${pixelProtection ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Link2 size={16} className="text-text-secondary" />
                                Link Tracking Protection
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Automatically strip UTM and tracking parameters from URLs when clicking links.</p>
                        </div>
                        <div
                            onClick={() => setLinkTracking(!linkTracking)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${linkTracking ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${linkTracking ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Ghost size={16} className="text-text-secondary" />
                                Hide IP on Send
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Strip your real IP address from outgoing email headers (Received headers).</p>
                        </div>
                        <div
                            onClick={() => setHideIp(!hideIp)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${hideIp ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${hideIp ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aliasing / Anonymity */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Anonymity</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Ghost size={16} className="text-text-secondary" />
                                Anonymous Replies
                            </h3>
                            <p className="text-[13px] text-text-tertiary">When replying to an email sent to a hide-my-email alias, automatically reply from that alias instead of your real address.</p>
                        </div>
                        <div
                            onClick={() => setAnonymousReplies(!anonymousReplies)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${anonymousReplies ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${anonymousReplies ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data & Telemetry */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Data & Telemetry</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <BrainCircuit size={16} className="text-text-secondary" />
                                AI Data Usage
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Allow anonymous fragments of your emails to be used to train Smart Compose.</p>
                        </div>
                        <div
                            onClick={() => setAiDataUsage(!aiDataUsage)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${aiDataUsage ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${aiDataUsage ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Activity size={16} className="text-text-secondary" />
                                App Telemetry & Analytics
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Send anonymous crash reports and usage statistics to help us improve the app.</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative bg-blue-600`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] translate-x-5`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Database size={16} className="text-text-secondary" />
                                Cookie Preferences
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Manage non-essential cookies on the web interface.</p>
                        </div>
                        <button className="text-[13px] font-semibold text-white hover:text-text-tertiary transition-colors">Manage Cookies</button>
                    </div>
                </div>
            </div>

            {/* Data Export */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Data Export</h2>
                <div className="bg-[#000] rounded-xl p-6 flex items-center justify-between border border-transparent">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-semibold text-white">Download Account Data</h3>
                        <p className="text-[13px] text-text-tertiary">Request an archive of your entire mailbox, contacts, and settings in standard formats (MBOX, VCF, JSON).</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Download size={14} /> Request Export
                    </button>
                </div>
            </div>

        </div>
    );
}
