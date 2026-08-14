"use client";

import React from 'react';
import {
    Globe, Server, Shield, Key, Users, Mail, Network, Lock,
    FileText, Activity, Box, Search, ArrowUpRight, CheckCircle2,
    Database, Building2, Palette
} from 'lucide-react';

const ADMIN_CATEGORIES = [
    {
        title: "Domain & DNS",
        icon: <Globe size={18} className="text-white" />,
        description: "Manage your custom domain names and DNS records.",
        items: [
            { name: "Domain Overview", status: "Active" },
            { name: "DNS Configuration" },
            { name: "MX Records", status: "Verified" },
            { name: "SPF Configuration", status: "Verified" },
            { name: "DKIM Signatures", status: "Verified" },
            { name: "DMARC Policy", status: "Strict" },
            { name: "BIMI Configuration" },
            { name: "MTA-STS" },
            { name: "TLS-RPT" },
        ]
    },
    {
        title: "Users & Mailboxes",
        icon: <Users size={18} className="text-white" />,
        description: "Control access, aliases, and shared resources.",
        items: [
            { name: "Mailboxes" },
            { name: "Aliases" },
            { name: "Distribution Lists" },
            { name: "Shared Mailboxes" },
            { name: "Roles & Permissions" },
            { name: "App Passwords" },
        ]
    },
    {
        title: "Mail Routing",
        icon: <Network size={18} className="text-white" />,
        description: "Advanced inbound and outbound routing rules.",
        items: [
            { name: "Routing Rules" },
            { name: "Inbound Gateway" },
            { name: "Outbound Gateway" },
            { name: "SMTP Relay" },
        ]
    },
    {
        title: "Security, Compliance & Logs",
        icon: <Shield size={18} className="text-white" />,
        description: "Monitor deliverability, spam, and audit trails.",
        items: [
            { name: "Email Logs" },
            { name: "Delivery Reports" },
            { name: "Message Trace" },
            { name: "Queue Management" },
            { name: "Quarantine" },
            { name: "Spam Reports" },
            { name: "Backup & Restore" },
            { name: "Retention Policies" },
            { name: "Compliance" },
            { name: "Audit Logs" },
        ]
    },
    {
        title: "Organization",
        icon: <Building2 size={18} className="text-white" />,
        description: "Manage billing, branding, and workspace limits.",
        items: [
            { name: "Organisation Profile" },
            { name: "Branding" },
            { name: "Storage Management" },
            { name: "API Access" },
        ]
    }
];

export function AdvancedAdminSettings() {
    return (
        <div className="flex flex-col gap-10">
            {/* Header / Intro */}
            <div className="bg-[#000] rounded-xl p-6 border border-[#fff]/5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-none bg-[#fff]/5 flex items-center justify-center shrink-0">
                    <Building2 size={24} className="text-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-[16px] font-semibold text-white">Custom Domain Administration</h2>
                    <p className="text-[13px] text-text-tertiary max-w-[600px] leading-relaxed">
                        This section scales from independent creators to enterprise organizations. Ensure your
                        custom domain is fully verified to guarantee the best possible deliverability for your team.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#fff]/10 px-2 py-0.5 rounded flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> example.com
                        </span>
                    </div>
                </div>
            </div>

            {/* Admin Grid */}
            <div className="grid grid-cols-1 gap-8">
                {ADMIN_CATEGORIES.map((category, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-1">
                            <div className="w-8 h-8 rounded-none bg-[#fff]/5 flex items-center justify-center">
                                {category.icon}
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-[15px] font-semibold text-white">{category.title}</h3>
                                <p className="text-[12px] text-text-tertiary">{category.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {category.items.map((item, i) => (
                                <button
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-[#000] border border-[#fff]/5 rounded-xl hover:border-[#fff]/20 transition-all cursor-pointer group hover:bg-[#fff]/5"
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[13px] font-semibold text-white group-hover:text-white transition-colors">{item.name}</span>
                                        {item.status ? (
                                            <span className="text-[11px] font-bold text-text-secondary bg-[#fff]/5 px-2 py-0.5 rounded mt-1">
                                                {item.status}
                                            </span>
                                        ) : null}
                                    </div>
                                    <ArrowUpRight size={16} className="text-text-tertiary group-hover:text-white transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
