"use client";

import React from 'react';
import { CreditCard, Download, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export function BillingSettings() {
    return (
        <div className="flex flex-col gap-8">

            {/* Current Plan */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Current Plan</h2>

                <div className="bg-[#000] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[18px] font-bold text-white">Pro Workspace</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-blue-700 px-2 py-0.5 rounded">Active</span>
                        </div>
                        <p className="text-[13px] text-text-tertiary">10 seats • 100 GB Storage • Custom Domains</p>
                        <div className="text-[14px] text-text-secondary mt-2">
                            <span className="text-white font-semibold">$50.00</span> / month
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button className="px-6 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors">
                            Manage Subscription
                        </button>
                        <button className="px-6 py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors flex items-center justify-center gap-1.5">
                            <Zap size={14} /> Upgrade Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Payment Method</h2>
                    <button className="text-[13px] font-semibold text-white hover:text-white/80 cursor-pointer transition-colors">Update</button>
                </div>

                <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-[#fff]/5 rounded flex items-center justify-center">
                            <CreditCard size={18} className="text-text-secondary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-white">Visa ending in 4242</span>
                            <span className="text-[12px] text-text-tertiary">Expires 12/2028</span>
                        </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck size={12} /> Secure
                    </span>
                </div>
            </div>

            {/* Billing Address & Tax */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Billing Details</h2>
                    <button className="text-[13px] font-semibold text-white hover:text-white/80 cursor-pointer transition-colors">Edit</button>
                </div>

                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] text-text-tertiary font-semibold">Billing Email</span>
                            <span className="text-[14px] font-semibold text-white">finance@theripun.com</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[12px] text-text-tertiary font-semibold">Tax ID / VAT</span>
                            <span className="text-[14px] font-semibold text-white">Not provided</span>
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <span className="text-[12px] text-text-tertiary font-semibold">Address</span>
                            <span className="text-[14px] font-semibold text-text-secondary">
                                Norest Corporation<br />
                                123 Tech Street, Suite 400<br />
                                San Francisco, CA 94105<br />
                                United States
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Invoice History</h2>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Date</th>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Jul 1, 2026</td>
                                <td className="px-4 py-3 text-text-secondary">$50.00</td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">Paid</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer"><Download size={16} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Jun 1, 2026</td>
                                <td className="px-4 py-3 text-text-secondary">$50.00</td>
                                <td className="px-4 py-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-green-500">Paid</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-text-tertiary hover:text-white transition-colors cursor-pointer"><Download size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
