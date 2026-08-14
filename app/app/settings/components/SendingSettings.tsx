"use client";

import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Key, Shield, Server, Activity, AlertCircle } from 'lucide-react';

export function SendingSettings() {
    const [copied, setCopied] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex flex-col gap-8">

            {/* SMTP Credentials */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">SMTP Credentials</h2>
                <div className="bg-[#000] rounded-xl p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">Username</label>
                            <div className="flex items-center gap-2 bg-[#222] rounded-lg px-3 py-2">
                                <input type="text" readOnly value="ripun@theripun.com" className="bg-transparent border-none outline-none text-[14px] text-white flex-1 font-medium" />
                                <button onClick={() => handleCopy("ripun@theripun.com", "user")} className="text-text-tertiary hover:text-white transition-colors cursor-pointer">
                                    {copied === "user" ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">Password</label>
                            <div className="flex items-center gap-2 bg-[#222] rounded-lg px-3 py-2">
                                <input type={showPassword ? "text" : "password"} readOnly value="nrst_smtp_8f92jK293mN1" className="bg-transparent border-none outline-none text-[14px] text-white flex-1 tracking-wider font-medium" />
                                <button onClick={() => setShowPassword(!showPassword)} className="text-[12px] font-semibold text-white hover:text-white mr-2 cursor-pointer transition-colors">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                                <button onClick={() => handleCopy("nrst_smtp_8f92jK293mN1", "pass")} className="text-text-tertiary hover:text-white transition-colors cursor-pointer">
                                    {copied === "pass" ? <Check size={16} className="text-white" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-full transition-colors cursor-pointer">
                            <Key size={14} strokeWidth={3} /> Generate New Password
                        </button>
                        <p className="text-[13px] font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> Generating a new password will invalidate the old one immediately.
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Details */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Connection Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Server size={14} /> Host</span>
                        <span className="text-[15px] text-white font-medium mt-1">smtp.norestmail.com</span>
                    </div>
                    <div className="bg-black rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Activity size={14} /> Port</span>
                        <span className="text-[15px] text-white font-medium mt-1">465 <span className="text-text-tertiary text-[12px]">(or 587)</span></span>
                    </div>
                    <div className="bg-black rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Shield size={14} /> Encryption</span>
                        <span className="text-[15px] text-white font-medium mt-1">TLS / SSL</span>
                    </div>
                    <div className="bg-black rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[12px] text-text-tertiary flex items-center gap-1.5"><Key size={14} /> Authentication</span>
                        <span className="text-[15px] text-white font-medium mt-1">Required</span>
                    </div>
                </div>
            </div>

            {/* Limits & Usage */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Outgoing Limits</h2>
                <div className="bg-black rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-medium text-white">Daily Sending Limit</span>
                        <span className="text-[14px] font-semibold text-white">342 / 1,000</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#222] rounded-none overflow-hidden">
                        <div className="h-full bg-white rounded-none" style={{ width: '34%' }}></div>
                    </div>
                    <p className="text-[13px] text-text-tertiary font-medium mt-4">Limits reset every 24 hours at midnight UTC.</p>
                </div>
            </div>

            {/* SMTP Logs */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Recent SMTP Activity</h2>
                    <button className="text-[13px] font-medium text-text-secondary hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors">
                        <RefreshCw size={14} /> Refresh Logs
                    </button>
                </div>
                <div className="w-full overflow-hidden rounded-xl bg-[#111]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-border-divider text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-medium">Timestamp</th>
                                <th className="px-4 py-3 font-medium">Recipient</th>
                                <th className="px-4 py-3 font-medium">IP Address</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider text-text-primary">
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3 text-text-secondary">Today, 10:42 AM</td>
                                <td className="px-4 py-3 font-mono">client@example.com</td>
                                <td className="px-4 py-3 text-text-tertiary font-mono">192.168.1.104</td>
                                <td className="px-4 py-3"><span className="text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded">250 OK (Delivered)</span></td>
                            </tr>
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3 text-text-secondary">Today, 09:15 AM</td>
                                <td className="px-4 py-3 font-mono">newsletter@subscribers.com</td>
                                <td className="px-4 py-3 text-text-tertiary font-mono">192.168.1.104</td>
                                <td className="px-4 py-3"><span className="text-green-500 font-semibold bg-green-500/10 px-2 py-0.5 rounded">250 OK (Delivered)</span></td>
                            </tr>
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3 text-text-secondary">Yesterday, 14:30 PM</td>
                                <td className="px-4 py-3 font-mono">unknown@baddomain.com</td>
                                <td className="px-4 py-3 text-text-tertiary font-mono">203.0.113.42</td>
                                <td className="px-4 py-3"><span className="text-red-500 font-semibold bg-red-500/10 px-2 py-0.5 rounded">550 No such user</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
