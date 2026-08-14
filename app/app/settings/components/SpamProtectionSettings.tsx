"use client";

import React, { useState } from 'react';
import { ShieldAlert, Ban, CheckCircle, ShieldCheck, Plus, Trash2, Crosshair, AlertTriangle } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function SpamProtectionSettings() {
    const [antiVirus, setAntiVirus] = useState(true);
    const [antiPhishing, setAntiPhishing] = useState(true);
    const [safeAttachments, setSafeAttachments] = useState("Off");

    return (
        <div className="flex flex-col gap-8">

            {/* Spam Sensitivity */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Spam Filter Sensitivity</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                    <Crosshair size={16} className="text-text-secondary" />
                                    Filter Level
                                </h3>
                                <p className="text-[13px] text-text-tertiary">Adjust how aggressively the system filters out suspected spam.</p>
                            </div>
                        </div>

                        {/* Custom Slider Mockup */}
                        <div className="relative px-2 py-4">
                            <div className="w-full h-2 bg-[#fff]/5 rounded-none"></div>
                            <div className="absolute top-4 left-0 h-2 bg-white rounded-l-none" style={{ width: '50%' }}></div>
                            <div className="absolute top-2.5 left-1/2 w-5 h-5 bg-white rounded-none shadow cursor-pointer transform -translate-x-1/2"></div>

                            <div className="flex justify-between mt-4 text-[12px] font-semibold text-text-secondary">
                                <span>Lenient</span>
                                <span className="text-white font-semibold">Standard</span>
                                <span>Aggressive</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Scanning */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Advanced Scanning</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <ShieldAlert size={16} className="text-text-secondary" />
                                Anti-Virus Scanning
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Scan all incoming attachments for known malware and viruses.</p>
                        </div>
                        <div
                            onClick={() => setAntiVirus(!antiVirus)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${antiVirus ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${antiVirus ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <ShieldCheck size={16} className="text-text-secondary" />
                                Anti-Phishing Protection
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Analyze links and sender domains to prevent spear-phishing attacks.</p>
                        </div>
                        <div
                            onClick={() => setAntiPhishing(!antiPhishing)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${antiPhishing ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${antiPhishing ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <AlertTriangle size={16} className="text-text-secondary" />
                                Safe Attachments (Quarantine)
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Quarantine suspicious attachments in a sandbox before delivering.</p>
                        </div>
                        <CustomDropdown options={["Off", "Delay Delivery", "Block Delivery"]} value={safeAttachments} onChange={setSafeAttachments} />
                    </div>
                </div>
            </div>

            {/* Allowed / Blocked Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Blocked Senders */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-text-primary">Blocked Senders</h2>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                        <table className="w-full text-left text-[13px]">
                            <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                                <tr className="hover:bg-[#111] transition-colors">
                                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                        <Ban size={14} className="text-red-500" />
                                        *@marketing.com
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#111] transition-colors">
                                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                        <Ban size={14} className="text-red-500" />
                                        spammer@bad.org
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Allowed Senders */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-text-primary">Allowed Senders</h2>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                        <table className="w-full text-left text-[13px]">
                            <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                                <tr className="hover:bg-[#111] transition-colors">
                                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        *@github.com
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-[#111] transition-colors">
                                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        boss@company.com
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
