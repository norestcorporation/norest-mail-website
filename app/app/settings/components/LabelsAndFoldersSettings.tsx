"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Folder, Tag as TagIcon, Settings } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function LabelsAndFoldersSettings() {
    const [sentMailFolder, setSentMailFolder] = useState("Sent");
    const [draftsFolder, setDraftsFolder] = useState("Drafts");
    const [spamFolder, setSpamFolder] = useState("Spam");
    const [trashFolder, setTrashFolder] = useState("Trash");

    return (
        <div className="flex flex-col gap-8">

            {/* Custom Folders */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Folders</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> New Folder
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Folder Name</th>
                                <th className="px-4 py-3 font-semibold">Emails</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <Folder size={16} className="text-text-tertiary" />
                                    <span className="font-semibold text-white">Projects</span>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">42</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Edit2 size={14} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <div className="w-4"></div> {/* Indent */}
                                    <Folder size={16} className="text-text-tertiary" />
                                    <span className="font-semibold text-white">Phoenix</span>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">15</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Edit2 size={14} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 flex items-center gap-2">
                                    <Folder size={16} className="text-text-tertiary" />
                                    <span className="font-semibold text-white">Invoices</span>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">128</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Edit2 size={14} /></button>
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Labels */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Labels</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> New Label
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-[14px] font-semibold text-white">Urgent</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="text-text-tertiary hover:text-white transition-colors"><Edit2 size={14} /></button>
                            <button className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    </div>
                    <div className="bg-[#000] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-[14px] font-semibold text-white">To Do</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="text-text-tertiary hover:text-white transition-colors"><Edit2 size={14} /></button>
                            <button className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    </div>
                    <div className="bg-[#000] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-[14px] font-semibold text-white">Client A</span>
                        </div>
                        <div className="flex gap-3">
                            <button className="text-text-tertiary hover:text-white transition-colors"><Edit2 size={14} /></button>
                            <button className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Default Folders */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">System Folders Mapping</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Folder size={14} /> Sent Mail</label>
                            <CustomDropdown options={["Sent", "Sent Items", "Sent Messages"]} value={sentMailFolder} onChange={setSentMailFolder} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Folder size={14} /> Drafts</label>
                            <CustomDropdown options={["Drafts"]} value={draftsFolder} onChange={setDraftsFolder} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Folder size={14} /> Junk / Spam</label>
                            <CustomDropdown options={["Spam", "Junk", "Junk E-mail"]} value={spamFolder} onChange={setSpamFolder} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Trash2 size={14} /> Trash</label>
                            <CustomDropdown options={["Trash", "Deleted Items", "Bin"]} value={trashFolder} onChange={setTrashFolder} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
