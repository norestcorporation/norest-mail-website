"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Bold, Italic, Link2, ImageIcon, Type, Smartphone } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function SignaturesSettings() {
    const [mobileSignature, setMobileSignature] = useState(false);
    const [newEmailSignature, setNewEmailSignature] = useState("Primary (Default)");
    const [replyEmailSignature, setReplyEmailSignature] = useState("Internal Short");

    return (
        <div className="flex flex-col gap-8">

            {/* Signatures List */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Your Signatures</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-200 rounded-full text-[13px] font-bold text-black transition-colors cursor-pointer">
                        <Plus size={14} /> New Signature
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-white/20 relative">
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button className="text-text-tertiary hover:text-white transition-colors"><Edit2 size={14} /></button>
                            <button className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <h3 className="text-[14px] font-semibold text-white mb-3">Primary (Default)</h3>
                        <div className="text-[13px] text-text-secondary p-3 bg-[#111] rounded-lg">
                            <span className="text-[18px] text-white" style={{ fontFamily: "'Brush Script MT', cursive" }}>Ripun</span><br />
                            CEO @ Norest<br />
                            <a href="#" className="text-white">theripun.com</a>
                        </div>
                    </div>
                    <div className="bg-[#000] rounded-xl p-5 border border-transparent relative">
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button className="text-text-tertiary hover:text-white transition-colors"><Edit2 size={14} /></button>
                            <button className="text-red-500/70 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <h3 className="text-[14px] font-semibold text-white mb-3">Internal Short</h3>
                        <div className="text-[13px] text-text-secondary p-3 bg-[#111] rounded-lg">
                            <span className="text-[18px] text-white" style={{ fontFamily: "'Brush Script MT', cursive" }}>Ripun</span><br />
                            Norest Engineering
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Defaults */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Signature Defaults</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">For New Emails</label>
                            <CustomDropdown
                                options={["Primary (Default)", "Internal Short", "No Signature"]}
                                value={newEmailSignature}
                                onChange={setNewEmailSignature}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-medium">For Replies / Forwards</label>
                            <CustomDropdown
                                options={["Primary (Default)", "Internal Short", "No Signature"]}
                                value={replyEmailSignature}
                                onChange={setReplyEmailSignature}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Signature */}
            <div className="bg-[#000] rounded-xl p-6">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222]">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                            <Smartphone size={16} className="text-text-secondary" />
                            Mobile Signature
                        </h3>
                        <p className="text-[13px] text-text-tertiary">Append a short text-only signature when sending from the mobile app.</p>
                    </div>
                    <div
                        onClick={() => setMobileSignature(!mobileSignature)}
                        className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${mobileSignature ? 'bg-white' : 'bg-[#333]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${mobileSignature ? 'bg-black translate-x-7' : 'bg-white translate-x-1'}`}></div>
                    </div>
                </div>

                {mobileSignature && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            defaultValue="Sent from Norest Mail on mobile"
                            className="bg-[#222] text-white text-[14px] rounded-lg px-4 py-2.5 outline-none font-medium w-full"
                        />
                    </div>
                )}
            </div>

            {/* Edit Mode (Mock Editor) */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Edit Signature</h2>
                <div className="bg-[#000] rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-[#222]">
                        <input
                            type="text"
                            defaultValue="Primary (Default)"
                            className="w-full bg-transparent text-white text-[15px] font-semibold outline-none"
                        />
                    </div>

                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-[#111] border-b border-[#222]">
                        <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Type size={14} /></button>
                        <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                        <button className="p-2 bg-[#222] rounded text-white transition-colors"><Bold size={14} /></button>
                        <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Italic size={14} /></button>
                        <div className="w-[1px] h-4 bg-[#333] mx-1"></div>
                        <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><Link2 size={14} /></button>
                        <button className="p-2 hover:bg-[#222] rounded text-text-secondary transition-colors"><ImageIcon size={14} /></button>
                    </div>

                    {/* Editor Body */}
                    <div className="p-4 h-32 text-[14px] text-white">
                        <span className="text-[20px]" style={{ fontFamily: "'Brush Script MT', cursive" }}>Ripun</span><br />
                        CEO @ Norest<br />
                        <span className="text-white cursor-pointer">theripun.com</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
