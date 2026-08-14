"use client";

import React, { useState } from 'react';
import { Forward, Plus, Trash2, CheckCircle, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ForwardingSettings() {
    const [forwardingEnabled, setForwardingEnabled] = useState(true);
    const [keepLocalCopy, setKeepLocalCopy] = useState(true);

    return (
        <div className="flex flex-col gap-8">

            {/* Global Forwarding Control */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Global Forwarding</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex items-center justify-between pb-6 mb-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Forward size={16} className="text-white" />
                                Forward All Incoming Mail
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Automatically redirect all emails received at this mailbox to another address.</p>
                        </div>
                        <div
                            onClick={() => setForwardingEnabled(!forwardingEnabled)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${forwardingEnabled ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${forwardingEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-6 transition-opacity ${!forwardingEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-4">
                            <span className="text-[14px] text-text-secondary whitespace-nowrap">Forward to:</span>
                            <div className="flex-1 flex items-center gap-2 bg-[#222] rounded-lg px-3 py-2 transition-colors">
                                <Mail size={16} className="text-text-tertiary" />
                                <input type="email" defaultValue="personal@gmail.com" className="bg-transparent border-none outline-none text-[14px] text-white flex-1 font-medium" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#333] px-2 py-0.5 rounded flex items-center gap-1">
                                    <ShieldCheck size={12} /> Verified
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-[#111] rounded-lg p-4">
                            <div>
                                <h4 className="text-[14px] font-semibold text-white">Keep Local Copy</h4>
                                <p className="text-[12px] text-text-tertiary mt-1">Store a copy of forwarded emails in your Norest Mail inbox.</p>
                            </div>
                            <div
                                onClick={() => setKeepLocalCopy(!keepLocalCopy)}
                                className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${keepLocalCopy ? 'bg-blue-600' : 'bg-[#444]'}`}
                            >
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${keepLocalCopy ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Forwarding Rules */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Custom Forwarding Rules</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded-full text-[13px] font-medium text-white transition-colors cursor-pointer">
                        <Plus size={14} /> Add Rule
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-border-divider text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-medium">Condition (If)</th>
                                <th className="px-4 py-3 font-medium">Action (Then)</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider text-text-primary">
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3">
                                    <span className="text-white font-medium">Subject contains:</span> <span className="text-white">"Invoice"</span>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">
                                    Forward to <span className="text-white font-medium">finance@theripun.com</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-white bg-[#222] px-2 py-0.5 rounded text-[12px] font-semibold">Active</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#000] bg-[#000] transition-colors">
                                <td className="px-4 py-3">
                                    <span className="text-white font-medium">Sender is:</span> <span className="text-white">boss@company.com</span>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">
                                    Forward to <span className="text-white font-medium">urgent@theripun.com</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[#888] bg-[#222] px-2 py-0.5 rounded text-[12px] font-semibold">Disabled</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Alert */}
            <div className="flex items-start gap-3 bg-[#111] rounded-xl p-4 mt-2">
                <AlertTriangle size={20} className="text-white shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-[14px] font-semibold text-white">Unverified Forwarding Addresses</h4>
                    <p className="text-[13px] text-text-tertiary font-medium mt-1">You have 1 forwarding rule pointing to an unverified address (backup@gmail.com). Forwarding to this address is paused until you click the verification link sent to that inbox.</p>
                    <button className="mt-3 text-[13px] font-semibold text-white hover:text-text-tertiary underline cursor-pointer transition-colors">
                        Resend Verification Email
                    </button>
                </div>
            </div>

        </div>
    );
}
