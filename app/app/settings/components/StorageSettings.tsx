"use client";

import React, { useState } from 'react';
import { HardDrive, Trash2, Mail, FileText, Image, FolderArchive, ArrowRight } from 'lucide-react';

export function StorageSettings() {
    const [emptyTrash, setEmptyTrash] = useState(true);

    return (
        <div className="flex flex-col gap-8">

            {/* Storage Usage Overview */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Storage Usage</h2>
                    <button className="text-[13px] font-semibold text-white hover:text-white/80 transition-colors cursor-pointer">Upgrade Storage</button>
                </div>

                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[14px] font-semibold text-white flex items-center gap-2">
                            <HardDrive size={16} className="text-text-secondary" />
                            Total Usage
                        </span>
                        <span className="text-[14px] font-semibold text-white">4.2 GB / 10 GB (42%)</span>
                    </div>

                    {/* Multicolored Progress Bar */}
                    <div className="w-full h-2 bg-[#fff]/5 flex mt-4">
                        <div className="h-full bg-white" style={{ width: '25%' }} title="Attachments (2.5 GB)"></div>
                        <div className="h-full bg-white/60" style={{ width: '12%' }} title="Emails (1.2 GB)"></div>
                        <div className="h-full bg-white/30" style={{ width: '5%' }} title="Trash (0.5 GB)"></div>
                    </div>

                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white"></div>
                            <span className="text-[12px] text-text-secondary">Attachments <span className="text-white font-semibold">2.5 GB</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white/60"></div>
                            <span className="text-[12px] text-text-secondary">Emails <span className="text-white font-semibold">1.2 GB</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white/30"></div>
                            <span className="text-[12px] text-text-secondary">Trash <span className="text-white font-semibold">0.5 GB</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Folder Sizes */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Breakdown by Folder</h2>
                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Folder</th>
                                <th className="px-4 py-3 font-semibold">Size</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <Mail size={14} className="text-text-secondary" />
                                    Inbox
                                </td>
                                <td className="px-4 py-3 text-text-secondary">1.8 GB</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-[12px] font-semibold text-white hover:text-white/80 transition-colors">Clean up</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <FolderArchive size={14} className="text-text-secondary" />
                                    Archive
                                </td>
                                <td className="px-4 py-3 text-text-secondary">1.9 GB</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-[12px] font-semibold text-white hover:text-white/80 transition-colors">Clean up</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                                    <Trash2 size={14} className="text-text-secondary" />
                                    Trash
                                </td>
                                <td className="px-4 py-3 text-text-secondary">0.5 GB</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-[12px] font-semibold text-white hover:text-white/80 transition-colors">Empty Now</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Storage Management Settings */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Storage Management</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Trash2 size={16} className="text-text-secondary" />
                                Empty Trash Automatically
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Permanently delete messages in Trash after 30 days.</p>
                        </div>
                        <div
                            onClick={() => setEmptyTrash(!emptyTrash)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${emptyTrash ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${emptyTrash ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <FileText size={16} className="text-text-secondary" />
                                Large Attachments Finder
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Quickly find and delete emails with attachments larger than 10MB.</p>
                        </div>
                        <button className="text-[13px] font-semibold text-white bg-[#fff]/5 hover:bg-[#fff]/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                            Scan <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
