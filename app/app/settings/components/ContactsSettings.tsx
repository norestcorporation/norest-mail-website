"use client";

import React, { useState } from 'react';
import { Upload, Download, Users, Plus, Trash2, Edit2, ShieldAlert, Sparkles, Rocket } from 'lucide-react';

export function ContactsSettings() {
    const [autoSave, setAutoSave] = useState(true);

    return (
        <div className="flex flex-col gap-8">

            {/* Import / Export */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Manage Contacts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">Import Contacts</h3>
                            <p className="text-[13px] text-text-tertiary mt-1">Upload a CSV or vCard file.</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Upload size={14} /> Import
                        </button>
                    </div>
                    <div className="bg-[#000] rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">Export Contacts</h3>
                            <p className="text-[13px] text-text-tertiary mt-1">Download as CSV or vCard.</p>
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>
            </div>

            {/* General Preferences */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Preferences</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Users size={16} className="text-text-secondary" />
                                Auto-save Contacts
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Automatically add people I reply to to my contacts list.</p>
                        </div>
                        <div
                            onClick={() => setAutoSave(!autoSave)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${autoSave ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoSave ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Rocket size={16} className="text-text-secondary" />
                                Suggested Contacts
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Show AI-powered suggestions when typing email addresses in Compose.</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative bg-blue-600`}>
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 translate-x-7`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Groups */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Contact Groups</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> New Group
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Group Name</th>
                                <th className="px-4 py-3 font-semibold">Members</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Engineering Team</td>
                                <td className="px-4 py-3 text-text-secondary">14 members</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Edit2 size={14} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Vendors</td>
                                <td className="px-4 py-3 text-text-secondary">8 members</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Edit2 size={14} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Blocked Contacts */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Blocked Contacts</h2>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <div className="p-4 border-b border-[#fff]/5 bg-[#111] flex items-center justify-between">
                        <span className="text-[13px] text-text-tertiary">Emails from these addresses will go directly to Spam.</span>
                        <button className="text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">Block New Address</button>
                    </div>
                    <table className="w-full text-left text-[13px]">
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <ShieldAlert size={14} className="text-red-500" />
                                    spammer@annoying.com
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-secondary hover:text-white transition-colors cursor-pointer">Unblock</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
