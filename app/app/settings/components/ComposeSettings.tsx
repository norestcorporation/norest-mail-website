"use client";

import React, { useState } from 'react';
import { Undo2, Type, MessageCircle, Lock, SpellCheck2, Sparkles, CheckSquare, Rocket } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function ComposeSettings() {
    const [richText, setRichText] = useState(true);
    const [markdown, setMarkdown] = useState(false);
    const [spellCheck, setSpellCheck] = useState(true);
    const [smartCompose, setSmartCompose] = useState(true);
    const [confidentialMode, setConfidentialMode] = useState(false);
    const [undoDelay, setUndoDelay] = useState("5 seconds");
    const [defaultReplyBehavior, setDefaultReplyBehavior] = useState("Reply All");
    const [defaultFont, setDefaultFont] = useState("Inter (Sans-serif)");
    const [defaultSize, setDefaultSize] = useState("Normal (14px)");

    return (
        <div className="flex flex-col gap-8">

            {/* Sending Options */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Sending Options</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Undo2 size={16} className="text-text-secondary" />
                                Undo Send Delay
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Time allowed to cancel a message after clicking send.</p>
                        </div>
                        <div className="w-48">
                            <CustomDropdown options={["5 seconds", "10 seconds", "20 seconds", "30 seconds"]} value={undoDelay} onChange={setUndoDelay} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <MessageCircle size={16} className="text-text-secondary" />
                                Default Reply Behavior
                            </h3>
                            <p className="text-[13px] text-text-tertiary">Choose the default action when replying to emails with multiple recipients.</p>
                        </div>
                        <div className="w-48">
                            <CustomDropdown options={["Reply All", "Reply"]} value={defaultReplyBehavior} onChange={setDefaultReplyBehavior} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Default CC/BCC */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Default CC / BCC</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <p className="text-[13px] text-text-tertiary mb-6">Automatically add these addresses to every email you send.</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold">Default CC</label>
                            <input type="email" placeholder="e.g. assistant@domain.com" className="bg-[#fff]/5 text-white text-[14px] rounded-lg px-4 py-2.5 outline-none font-medium w-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold">Default BCC</label>
                            <input type="email" placeholder="e.g. crm@domain.com" className="bg-[#fff]/5 text-white text-[14px] rounded-lg px-4 py-2.5 outline-none font-medium w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Formatting */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Formatting</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2"><Type size={14} /> Default Font</label>
                            <CustomDropdown options={["Inter (Sans-serif)", "Arial", "Georgia", "Roboto", "Fira Code (Monospace)"]} value={defaultFont} onChange={setDefaultFont} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold">Default Size</label>
                            <CustomDropdown options={["Small (12px)", "Normal (14px)", "Large (16px)", "Huge (20px)"]} value={defaultSize} onChange={setDefaultSize} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[14px] font-semibold text-white">Enable Rich Text Editing</h3>
                                <p className="text-[12px] text-text-tertiary">Allow bold, italics, images, and HTML composition.</p>
                            </div>
                            <div onClick={() => setRichText(!richText)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${richText ? 'bg-blue-600' : 'bg-[#333]'}`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${richText ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[14px] font-semibold text-white">Enable Markdown Support</h3>
                                <p className="text-[12px] text-text-tertiary">Automatically format text using Markdown syntax (e.g. **bold**).</p>
                            </div>
                            <div onClick={() => setMarkdown(!markdown)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${markdown ? 'bg-blue-600' : 'bg-[#333]'}`}>
                                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${markdown ? 'translate-x-5' : 'translate-x-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Features & Security */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Assistance & Security</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <SpellCheck2 size={16} className="text-text-secondary" />
                                Spell & Grammar Check
                            </h3>
                        </div>
                        <div onClick={() => setSpellCheck(!spellCheck)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${spellCheck ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${spellCheck ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Rocket size={16} className="text-text-secondary" />
                                Smart Compose AI
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Suggest sentences and phrases as you type.</p>
                        </div>
                        <div onClick={() => setSmartCompose(!smartCompose)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${smartCompose ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${smartCompose ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Lock size={16} className="text-text-secondary" />
                                Confidential Mode (Default)
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Send emails that expire and prevent forwarding/copying.</p>
                        </div>
                        <div onClick={() => setConfidentialMode(!confidentialMode)} className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${confidentialMode ? 'bg-blue-600' : 'bg-[#333]'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${confidentialMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <CheckSquare size={16} className="text-text-secondary" />
                                Request Read Receipt
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Request a read receipt for all outgoing emails by default.</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative bg-[#333]`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] translate-x-1`}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
