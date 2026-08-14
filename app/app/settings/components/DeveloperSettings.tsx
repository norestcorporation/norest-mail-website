"use client";

import React, { useState } from 'react';
import { Key, Webhook, Activity, Plus, Trash2, Eye, EyeOff, FileText, Send } from 'lucide-react';

export function DeveloperSettings() {
    const [showToken, setShowToken] = useState(false);

    return (
        <div className="flex flex-col gap-8">

            {/* Personal Access Tokens */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-text-primary">Personal Access Tokens</h2>
                        <p className="text-[13px] text-text-tertiary">Use tokens to authenticate with the Norest Mail API.</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> Generate Token
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Token Name</th>
                                <th className="px-4 py-3 font-semibold">Prefix</th>
                                <th className="px-4 py-3 font-semibold">Last Used</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#fff]/5 transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <Key size={14} className="text-text-secondary" />
                                    CI/CD Deployment
                                </td>
                                <td className="px-4 py-3 font-mono">nrst_pat_a9f...</td>
                                <td className="px-4 py-3 text-text-secondary">Today, 2:40 PM</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Webhooks */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-text-primary">Webhooks</h2>
                        <p className="text-[13px] text-text-tertiary">Receive real-time HTTP payloads when events occur in your mailbox.</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> Add Webhook
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Endpoint URL</th>
                                <th className="px-4 py-3 font-semibold">Events</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#fff]/5 transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <Webhook size={14} className="text-text-secondary" />
                                    https://api.mycrm.com/webhook/mail
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold text-white bg-[#fff]/10 px-2 py-0.5 rounded">message.received</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold text-white bg-[#fff]/10 px-2 py-0.5 rounded">Active</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3" title="Test Payload"><Send size={16} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SMTP API */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">SMTP API</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <p className="text-[13px] text-text-tertiary mb-6">Send transactional emails programmatically via the SMTP API. Your SMTP limits are distinct from webmail limits.</p>

                    <div className="flex items-center gap-4 bg-[#fff]/5 p-4 rounded-lg mb-6">
                        <div className="flex-1">
                            <label className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-2 block">SMTP Key</label>
                            <div className="flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-white font-mono">
                                    {showToken ? "nrst_smtp_8aB29X9cM1L0pP92Xz" : "••••••••••••••••••••••••••••"}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setShowToken(!showToken)} className="p-2 hover:bg-[#fff]/10 rounded-full text-text-secondary hover:text-white transition-colors cursor-pointer">
                            {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Usage & Limits */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">API Usage & Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Activity size={16} className="text-text-secondary" />
                                Rate Limit (Requests)
                            </h3>
                            <span className="text-[14px] font-semibold text-white">42 / 1,000</span>
                        </div>
                        <div className="w-full h-2 bg-[#fff]/5 mt-4">
                            <div className="h-full bg-white" style={{ width: '4.2%' }}></div>
                        </div>
                        <p className="text-[12px] text-text-tertiary mt-2">Resets in 45 minutes</p>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <FileText size={16} className="text-text-secondary" />
                                Audit Logs
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Download a JSON log of all API requests made in the last 7 days.</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            Download
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
