"use client";

import React from 'react';
import { Users, Plus, Shield, Settings, Trash2, Mail, UserPlus, HardDrive } from 'lucide-react';

export function TeamSettings() {
    return (
        <div className="flex flex-col gap-8">

            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5">
                    <h3 className="text-[14px] text-text-secondary font-semibold flex items-center gap-2 mb-2">
                        <Users size={16} /> Total Members
                    </h3>
                    <div className="text-2xl font-semibold text-white">4 <span className="text-[14px] text-text-tertiary font-normal">/ 10 seats</span></div>
                </div>
                <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5">
                    <h3 className="text-[14px] text-text-secondary font-semibold flex items-center gap-2 mb-2">
                        <Mail size={16} /> Shared Mailboxes
                    </h3>
                    <div className="text-2xl font-semibold text-white">2</div>
                </div>
                <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5">
                    <h3 className="text-[14px] text-text-secondary font-semibold flex items-center gap-2 mb-2">
                        <HardDrive size={16} /> Team Storage
                    </h3>
                    <div className="text-2xl font-semibold text-white">12 GB <span className="text-[14px] text-text-tertiary font-normal">/ 100 GB</span></div>
                </div>
            </div>

            {/* Members List */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Workspace Members</h2>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <UserPlus size={14} /> Invite Users
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">User</th>
                                <th className="px-4 py-3 font-semibold">Role</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#fff]/10 flex items-center justify-center text-white font-bold">R</div>
                                        <div>
                                            <div className="font-semibold text-white">Ripun (You)</div>
                                            <div className="text-[12px] text-text-tertiary">ripun@theripun.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[12px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                                        <Shield size={12} /> Owner
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">Active</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Settings size={16} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#fff]/10 flex items-center justify-center text-white font-bold">A</div>
                                        <div>
                                            <div className="font-semibold text-white">Alice</div>
                                            <div className="text-[12px] text-text-tertiary">alice@theripun.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-semibold text-text-secondary">Admin</td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">Active</span>
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

            {/* Shared Mailboxes */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Shared Mailboxes</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> Create Shared Mailbox
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Mailbox Name</th>
                                <th className="px-4 py-3 font-semibold">Address</th>
                                <th className="px-4 py-3 font-semibold">Members</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Support Team</td>
                                <td className="px-4 py-3 text-text-secondary">support@theripun.com</td>
                                <td className="px-4 py-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border border-[#111] bg-[#fff]/10 flex items-center justify-center text-[10px] text-white">R</div>
                                        <div className="w-6 h-6 rounded-full border border-[#111] bg-[#fff]/10 flex items-center justify-center text-[10px] text-white">A</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer mr-3"><Settings size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
