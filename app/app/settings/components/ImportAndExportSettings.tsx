"use client";

import React from 'react';
import { Download, Upload, Server, Database, Globe } from 'lucide-react';

export function ImportAndExportSettings() {
    return (
        <div className="flex flex-col gap-8">

            {/* Import Mail */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Import Mail</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <p className="text-[13px] text-text-tertiary mb-6">Bring your existing emails and folders from another provider into Norest Mail.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#fff]/5 rounded-lg p-4 hover:border-[#fff]/20 transition-colors cursor-pointer bg-[#fff]/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Globe size={18} className="text-white" />
                                <h3 className="text-[14px] font-semibold text-white">Gmail / Google Workspace</h3>
                            </div>
                            <p className="text-[12px] text-text-tertiary">Sign in with Google to transfer your inbox automatically.</p>
                        </div>

                        <div className="border border-[#fff]/5 rounded-lg p-4 hover:border-[#fff]/20 transition-colors cursor-pointer bg-[#fff]/5">
                            <div className="flex items-center gap-3 mb-2">
                                <Server size={18} className="text-white" />
                                <h3 className="text-[14px] font-semibold text-white">Other IMAP Server</h3>
                            </div>
                            <p className="text-[12px] text-text-tertiary">Provide IMAP credentials to sync from Yahoo, Outlook, or custom servers.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-[#fff]/5 pt-6">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Upload size={14} /> Upload MBOX File
                        </button>
                    </div>
                </div>
            </div>

            {/* Export Mail */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Export Mailbox</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <p className="text-[13px] text-text-tertiary mb-6">Download a complete copy of your emails, contacts, and calendar events for offline backup or migration.</p>

                    <div className="flex flex-col gap-4 bg-[#fff]/5 border border-[#fff]/5 rounded-lg p-4 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#fff]/10 bg-[#000] checked:bg-white accent-white" />
                            <span className="text-[13px] font-semibold text-white">Emails (MBOX format)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#fff]/10 bg-[#000] checked:bg-white accent-white" />
                            <span className="text-[13px] font-semibold text-white">Contacts (vCard format)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#fff]/10 bg-[#000] checked:bg-white accent-white" />
                            <span className="text-[13px] font-semibold text-white">Calendar Events (iCal format)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#fff]/10 bg-[#000] checked:bg-white accent-white" />
                            <span className="text-[13px] font-semibold text-white">Settings & Filters (JSON format)</span>
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Download size={14} /> Request Export Archive
                        </button>
                    </div>
                </div>
            </div>

            {/* Previous Exports */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Export History</h2>
                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Date Requested</th>
                                <th className="px-4 py-3 font-semibold">Size</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#fff]/5 transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Jan 15, 2026</td>
                                <td className="px-4 py-3 text-text-secondary font-semibold">2.4 GB</td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold text-white bg-[#fff]/10 px-2 py-0.5 rounded">Expired</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="text-text-tertiary">Unavailable</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
