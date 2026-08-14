"use client";

import React, { useState } from 'react';
import { Copy, Check, CheckCheck, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IosSpinner = ({ className = "w-5 h-5" }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const dnsRecords = [
    { id: 1, type: "MX", host: "@", value: "mx1.norestmail.com", priority: "10" },
    { id: 2, type: "MX", host: "@", value: "mx2.norestmail.com", priority: "20" },
    { id: 3, type: "TXT", host: "@", value: "v=spf1 include:spf.norestmail.com ~all", priority: "—" },
    { id: 4, type: "CNAME", host: "default._domainkey", value: "dkim.norestmail.com", priority: "—" },
    { id: 5, type: "TXT", host: "_dmarc", value: "v=DMARC1; p=quarantine", priority: "—" },
];

export function DomainsSettings() {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCheckingManual, setIsCheckingManual] = useState(false);
    const [showPropagationMessage, setShowPropagationMessage] = useState(false);
    const [isVerified, setIsVerified] = useState(true);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [id]: false }));
        }, 2000);
    };

    const handleCheckVerified = () => {
        setIsCheckingManual(true);
        setShowPropagationMessage(false);
        setTimeout(() => {
            setIsCheckingManual(false);
            setIsVerified(true);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 pt-4">
            <div className="mb-2">
                <h2 className="text-lg font-semibold text-text-primary">Domain Configuration</h2>
                <p className="text-text-secondary text-[14px] mt-1">Required DNS records for <span className="font-bold text-white">@theripun.com</span></p>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-border-divider bg-[#111]">
                <div className="overflow-x-auto pb-1">
                    <table className="w-full text-left text-[14px]">
                        <thead className="bg-[#000] border-b border-border-divider text-text-secondary">
                            <tr>
                                <th className="px-4 py-4 font-medium w-[10%]">Type</th>
                                <th className="px-4 py-4 font-medium w-[20%]">Host</th>
                                <th className="px-4 py-4 font-medium w-[30%]">Value</th>
                                <th className="px-4 py-4 font-medium w-[10%]">Priority</th>
                                <th className="px-4 py-4 font-medium w-[10%]">Status</th>
                                <th className="px-4 py-4 font-medium text-right w-[20%]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider text-text-primary">
                            {dnsRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-bg-surface transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="bg-[#222] border border-[#333] text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide w-fit">
                                            {record.type}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-white/90 font-mono">
                                        {record.host}
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-white/90 font-mono truncate max-w-[200px]" title={record.value}>
                                        {record.value}
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-text-tertiary">
                                        {record.priority}
                                    </td>
                                    <td className="py-4 px-4 text-[14px]">
                                        {isVerifying ? (
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <div className="w-3.5 h-3.5 border-2 border-text-tertiary border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-white animate-in fade-in zoom-in duration-300">
                                                <div className="bg-white text-black rounded-full p-0.5 shadow-sm">
                                                    <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-right flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleCopy(record.host, `host-${record.id}`)}
                                            className="text-[12px] font-medium text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 bg-[#222] border border-[#333] shadow-sm px-2.5 py-1 rounded-md cursor-pointer"
                                        >
                                            {copiedStates[`host-${record.id}`] ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                                            Host
                                        </button>
                                        <button
                                            onClick={() => handleCopy(record.value, `value-${record.id}`)}
                                            className="text-[12px] font-medium text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 bg-[#222] border border-[#333] shadow-sm px-2.5 py-1 rounded-md cursor-pointer"
                                        >
                                            {copiedStates[`value-${record.id}`] ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                                            Value
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button
                    onClick={handleCheckVerified}
                    disabled={isCheckingManual}
                    className="cursor-pointer bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-full font-medium text-[14px] transition-colors flex items-center justify-center w-max gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isCheckingManual ? <IosSpinner className="w-4 h-4 text-black" /> : <ShieldCheck className="w-4 h-4" />}
                    {isCheckingManual ? "Checking..." : "Verify DNS Records"}
                </button>
            </div>
        </div>
    );
}
