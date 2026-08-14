"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Settings, Download, Upload, Archive, ArrowRight, StopCircle } from 'lucide-react';

export function FiltersAndRulesSettings() {
    const [autoArchive, setAutoArchive] = useState(false);
    const [stopProcessing, setStopProcessing] = useState(false);

    return (
        <div className="flex flex-col gap-8">

            {/* Global Rule Settings */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Global Rule Settings</h2>
                <div className="bg-[#000] rounded-xl p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-[#fff]/5 pb-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                Auto Archive Old Mail
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Automatically move emails older than 90 days to the Archive folder.</p>
                        </div>
                        <div
                            onClick={() => setAutoArchive(!autoArchive)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${autoArchive ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoArchive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                Stop Processing More Rules
                            </h3>
                            <p className="text-[13px] text-text-tertiary">If a rule matches, immediately stop evaluating subsequent rules.</p>
                        </div>
                        <div
                            onClick={() => setStopProcessing(!stopProcessing)}
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${stopProcessing ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${stopProcessing ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inbox Rules */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Inbox Rules</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded-full text-[13px] font-medium text-white transition-colors cursor-pointer">
                            <Download size={14} /> Export
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222] hover:bg-[#333] rounded-full text-[13px] font-medium text-white transition-colors cursor-pointer">
                            <Upload size={14} /> Import
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-[13px] font-medium text-white transition-colors cursor-pointer">
                            <Plus size={14} /> New Rule
                        </button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Rule Name</th>
                                <th className="px-4 py-3 font-semibold">Conditions (If)</th>
                                <th className="px-4 py-3 font-semibold">Actions (Then)</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-medium text-white">Project Phoenix</td>
                                <td className="px-4 py-3">
                                    <span className="text-text-secondary">Subject includes:</span> <span className="text-white">"Phoenix"</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-white">
                                        Mark Important <ArrowRight size={12} className="text-text-tertiary" /> Move to "Projects"
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Settings size={16} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-medium text-white">Spam Newsletters</td>
                                <td className="px-4 py-3">
                                    <span className="text-text-secondary">Sender includes:</span> <span className="text-white">"newsletter@"</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-white">
                                        Mark Read <ArrowRight size={12} className="text-text-tertiary" /> Delete
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Settings size={16} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
