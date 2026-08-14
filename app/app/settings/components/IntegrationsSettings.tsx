"use client";

import React from 'react';
import { Cloud, Video, MessageSquare, Zap, ExternalLink, HardDrive } from 'lucide-react';

export function IntegrationsSettings() {
    return (
        <div className="flex flex-col gap-8">

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Connected Apps</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fff]/5 flex items-center justify-center">
                                <HardDrive size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-white">Google Drive</h3>
                                <p className="text-[12px] text-text-tertiary">Attach large files directly from Drive.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#fff]/10 px-2 py-0.5 rounded">Connected</span>
                            <button className="text-[13px] font-semibold text-text-secondary hover:text-white transition-colors cursor-pointer">Configure</button>
                        </div>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fff]/5 flex items-center justify-center">
                                <MessageSquare size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-white">Slack</h3>
                                <p className="text-[12px] text-text-tertiary">Send emails directly to Slack channels.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#fff]/10 px-2 py-0.5 rounded">Connected</span>
                            <button className="text-[13px] font-semibold text-text-secondary hover:text-white transition-colors cursor-pointer">Configure</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Available Integrations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fff]/5 border border-[#fff]/10 flex items-center justify-center">
                                <Cloud size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-white">OneDrive</h3>
                                <p className="text-[12px] text-text-tertiary">Attach files from Microsoft OneDrive.</p>
                            </div>
                        </div>
                        <button className="w-full mt-2 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            Connect <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fff]/5 border border-[#fff]/10 flex items-center justify-center">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-white">Zapier</h3>
                                <p className="text-[12px] text-text-tertiary">Automate workflows with 3000+ apps.</p>
                            </div>
                        </div>
                        <button className="w-full mt-2 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            Connect <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#fff]/5 border border-[#fff]/10 flex items-center justify-center">
                                <Video size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-semibold text-white">Zoom</h3>
                                <p className="text-[12px] text-text-tertiary">Add meeting links to calendar invites.</p>
                            </div>
                        </div>
                        <button className="w-full mt-2 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                            Connect <ExternalLink size={14} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
