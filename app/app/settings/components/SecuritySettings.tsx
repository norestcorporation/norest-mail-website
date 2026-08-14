"use client";

import React, { useState } from 'react';
import { Key, Smartphone, Fingerprint, Map, Globe, ShieldAlert, Monitor, Plus, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function SecuritySettings() {
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [suspiciousLogin, setSuspiciousLogin] = useState(true);
    const [encryption, setEncryption] = useState(true);
    const [blockedCountries, setBlockedCountries] = useState("No countries blocked");

    return (
        <div className="flex flex-col gap-8">

            {/* Authentication Methods */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Authentication & Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-transparent">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Fingerprint size={16} className="text-text-secondary" />
                                Passkeys
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                        </div>
                        <p className="text-[12px] text-text-tertiary mb-4">Sign in securely using face, fingerprint, or device PIN without a password.</p>
                        <button className="w-full py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors">Manage Passkeys</button>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-transparent">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Smartphone size={16} className="text-text-secondary" />
                                2FA (Authenticator)
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                        </div>
                        <p className="text-[12px] text-text-tertiary mb-4">Protect your account with a time-based code from an authenticator app.</p>
                        <button className="w-full py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors">Manage 2FA</button>
                    </div>

                    <div className="bg-[#000] rounded-xl p-5 border border-transparent">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                                <Key size={16} className="text-text-secondary" />
                                Security Keys
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#888] bg-[#222] px-2 py-0.5 rounded">Off</span>
                        </div>
                        <p className="text-[12px] text-text-tertiary mb-4">Use a physical hardware key (e.g. YubiKey) for maximum security.</p>
                        <button className="w-full py-2 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-lg text-[13px] font-semibold text-white transition-colors">Setup Key</button>
                    </div>
                </div>
            </div>

            {/* Account Protection */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Account Protection</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <ShieldAlert size={16} className="text-text-secondary" />
                                Suspicious Login Detection
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Automatically block sign-ins from highly anomalous locations or IP addresses.</p>
                        </div>
                        <div
                            onClick={() => setSuspiciousLogin(!suspiciousLogin)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${suspiciousLogin ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${suspiciousLogin ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Monitor size={16} className="text-text-secondary" />
                                Login Alerts
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Receive an email notification whenever a new device signs into your account.</p>
                        </div>
                        <div
                            onClick={() => setLoginAlerts(!loginAlerts)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${loginAlerts ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${loginAlerts ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Lock size={16} className="text-text-secondary" />
                                End-to-End Encryption (E2EE)
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Enable zero-knowledge encryption for emails between Norest Mail users.</p>
                        </div>
                        <div
                            onClick={() => setEncryption(!encryption)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${encryption ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${encryption ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Restrictions */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Network Restrictions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 flex flex-col gap-4">
                        <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                            <Globe size={16} className="text-text-secondary" />
                            Block Countries
                        </h3>
                        <p className="text-[13px] text-text-tertiary">Deny all login attempts originating from specific countries.</p>
                        <CustomDropdown options={["No countries blocked", "Manage Blocklist (0)"]} value={blockedCountries} onChange={setBlockedCountries} />
                    </div>
                    <div className="bg-[#000] rounded-xl p-5 flex flex-col gap-4">
                        <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
                            <Map size={16} className="text-text-secondary" />
                            Allowed IP Addresses
                        </h3>
                        <p className="text-[13px] text-text-tertiary">Restrict access to your mailbox to specific, trusted IP ranges.</p>
                        <input type="text" placeholder="e.g. 192.168.1.1/24" className="bg-[#fff]/5 text-white text-[13px] rounded-lg px-4 py-2.5 outline-none font-semibold w-full" />
                    </div>
                </div>
            </div>

            {/* App Passwords */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-text-primary">App Passwords</h2>
                        <p className="text-[13px] text-text-tertiary">Generate single-purpose passwords for IMAP/SMTP clients that don't support modern auth.</p>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff]/5 hover:bg-[#fff]/10 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> New App Password
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">App Name</th>
                                <th className="px-4 py-3 font-semibold">Last Used</th>
                                <th className="px-4 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Apple Mail (iPhone)</td>
                                <td className="px-4 py-3 text-text-secondary">Today, 10:45 AM</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Scanner Printer (Office)</td>
                                <td className="px-4 py-3 text-text-secondary">Oct 12, 2026</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-red-500/70 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Active Sessions</h2>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        Revoke All Sessions
                    </button>
                </div>

                <div className="w-full overflow-hidden rounded-xl bg-[#000]">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#000] border-b border-[#fff]/5 text-text-secondary">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Device / Browser</th>
                                <th className="px-4 py-3 font-semibold">IP Address</th>
                                <th className="px-4 py-3 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#fff]/5 text-text-primary">
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Chrome on macOS</td>
                                <td className="px-4 py-3 font-semibold">192.168.1.104</td>
                                <td className="px-4 py-3 text-right text-white font-semibold">Current Session</td>
                            </tr>
                            <tr className="hover:bg-[#111] transition-colors">
                                <td className="px-4 py-3 font-semibold text-white">Safari on iOS</td>
                                <td className="px-4 py-3 font-semibold">172.56.21.99</td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-red-500 hover:text-red-400 font-medium transition-colors cursor-pointer">Revoke</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
