"use client";

import React, { useState } from 'react';
import { Copy, Check, Server, Activity, Shield, Key, Smartphone, Laptop, AlertCircle, ChevronDown } from 'lucide-react';

export function ReceivingSettings() {
    const [copied, setCopied] = useState<string | null>(null);
    const [imapEnabled, setImapEnabled] = useState(true);
    const [popEnabled, setPopEnabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [limitDropdownOpen, setLimitDropdownOpen] = useState(false);
    const [selectedLimit, setSelectedLimit] = useState("No Limit");

    const limits = ["No Limit", "Last 30 Days", "Last 3 Months", "10,000 Messages"];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8">

            {/* Protocol Toggles */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Protocols</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">IMAP Access</h3>
                            <p className="text-[13px] text-text-tertiary mt-1">Sync emails across multiple devices in real-time.</p>
                        </div>
                        <div
                            onClick={() => setImapEnabled(!imapEnabled)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${imapEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${imapEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="bg-[#000] rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">POP3 Access</h3>
                            <p className="text-[13px] text-text-tertiary mt-1">Download emails to your device and remove from server.</p>
                        </div>
                        <div
                            onClick={() => setPopEnabled(!popEnabled)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${popEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${popEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* IMAP Credentials & Server */}
            <div className={`flex flex-col gap-4 transition-opacity ${!imapEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <h2 className="text-lg font-semibold text-text-primary">IMAP Configuration</h2>
                <div className="bg-[#000] rounded-xl p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">Username</label>
                            <div className="flex items-center gap-2 bg-[#222] rounded-lg px-3 py-2">
                                <input type="text" readOnly value="ripun@theripun.com" className="bg-transparent border-none outline-none text-[14px] text-white flex-1 font-medium" />
                                <button onClick={() => handleCopy("ripun@theripun.com", "imap-user")} className="text-text-tertiary hover:text-white transition-colors cursor-pointer">
                                    {copied === "imap-user" ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">Password</label>
                            <div className="flex items-center gap-2 bg-[#222] rounded-lg px-3 py-2">
                                <input type={showPassword ? "text" : "password"} readOnly value="nrst_imap_9bX4kP12mQ8" className="bg-transparent border-none outline-none text-[14px] text-white flex-1 tracking-wider font-medium" />
                                <button onClick={() => setShowPassword(!showPassword)} className="text-[12px] font-semibold text-white hover:text-white mr-2 cursor-pointer transition-colors">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                <button onClick={() => handleCopy("nrst_imap_9bX4kP12mQ8", "imap-pass")} className="text-text-tertiary hover:text-white transition-colors cursor-pointer">
                                    {copied === "imap-pass" ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Server size={14} /> Incoming Server (IMAP)</span>
                            <span className="text-[15px] text-white font-medium mt-1">imap.norestmail.com</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Activity size={14} /> Port</span>
                            <span className="text-[15px] text-white font-medium mt-1">993</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Shield size={14} /> Security</span>
                            <span className="text-[15px] font-medium text-white mt-1">SSL / TLS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Limits */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Download Limits</h2>
                <div className="bg-[#000] rounded-xl p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-[15px] font-semibold text-white">Folder Size Limit (IMAP)</h3>
                        <p className="text-[13px] mt-1">Limit the amount of emails synced to devices to save local storage.</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setLimitDropdownOpen(!limitDropdownOpen)}
                            className="flex items-center gap-2 bg-[#222] text-white text-[13px] rounded-lg px-4 py-2 cursor-pointer font-medium"
                        >
                            {selectedLimit} <ChevronDown size={14} className="text-text-tertiary" />
                        </button>
                        {limitDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#222] rounded-lg shadow-xl overflow-hidden z-10 border border-[#333]">
                                {limits.map(l => (
                                    <div
                                        key={l}
                                        onClick={() => { setSelectedLimit(l); setLimitDropdownOpen(false); }}
                                        className="px-4 py-2.5 text-[13px] text-text-secondary hover:text-white hover:bg-[#333] cursor-pointer transition-colors"
                                    >
                                        {l}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Devices */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Recent IMAP/POP Devices</h2>
                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-border-divider text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-medium">Device / Client</th>
                                <th className="px-4 py-3 font-medium">Protocol</th>
                                <th className="px-4 py-3 font-medium">Location / IP</th>
                                <th className="px-4 py-3 font-medium">Last Sync</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider text-text-primary">
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <Smartphone size={16} className="text-text-tertiary" />
                                    <span className="font-medium text-white">Apple Mail (iOS)</span>
                                </td>
                                <td className="px-4 py-3 font-medium">IMAP</td>
                                <td className="px-4 py-3 text-text-secondary">San Francisco, CA (192.168.1.5)</td>
                                <td className="px-4 py-3 text-white">Just now</td>
                            </tr>
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <Laptop size={16} className="text-text-tertiary" />
                                    <span className="font-medium text-white">Thunderbird (macOS)</span>
                                </td>
                                <td className="px-4 py-3 font-medium">IMAP</td>
                                <td className="px-4 py-3 text-text-secondary">San Francisco, CA (192.168.1.10)</td>
                                <td className="px-4 py-3">2 hours ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
