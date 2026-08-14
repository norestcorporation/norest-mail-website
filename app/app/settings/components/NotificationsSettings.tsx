"use client";

import React, { useState } from 'react';
import { Bell, Volume2, Monitor, Mail, Smartphone, BellOff } from 'lucide-react';

export function NotificationsSettings() {
    const [desktopNotifications, setDesktopNotifications] = useState(true);
    const [sounds, setSounds] = useState(true);

    return (
        <div className="flex flex-col gap-8">

            {/* Global Settings */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Global Preferences</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Monitor size={16} className="text-text-secondary" />
                                Desktop Notifications
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Allow Norest Mail to show browser notifications.</p>
                        </div>
                        <div
                            onClick={() => setDesktopNotifications(!desktopNotifications)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${desktopNotifications ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${desktopNotifications ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Volume2 size={16} className="text-text-secondary" />
                                Notification Sounds
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Play a sound when a new email arrives.</p>
                        </div>
                        <div
                            onClick={() => setSounds(!sounds)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${sounds ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${sounds ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Types */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Notify me about...</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="flex flex-col gap-6">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="radio" name="notify_type" className="peer appearance-none w-5 h-5 border-2 border-[#fff]/10 rounded-full checked:border-white transition-colors" />
                                <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-white group-hover:text-white/80 transition-colors">All New Mail</span>
                                <span className="text-[13px] text-text-tertiary">Notify me for every single email that arrives in my inbox.</span>
                            </div>
                        </label>

                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="radio" name="notify_type" defaultChecked className="peer appearance-none w-5 h-5 border-2 border-[#fff]/10 rounded-full checked:border-white transition-colors" />
                                <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-white group-hover:text-white/80 transition-colors">Important Only</span>
                                <span className="text-[13px] text-text-tertiary">Only notify me for emails marked as important or from VIP contacts.</span>
                            </div>
                        </label>

                        <label className="flex items-start gap-4 cursor-pointer group">
                            <div className="mt-0.5 relative flex items-center justify-center">
                                <input type="radio" name="notify_type" className="peer appearance-none w-5 h-5 border-2 border-[#fff]/10 rounded-full checked:border-white transition-colors" />
                                <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-semibold text-white group-hover:text-white/80 transition-colors">None</span>
                                <span className="text-[13px] text-text-tertiary">Do not notify me about any new emails.</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Mobile Push */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Mobile App</h2>
                <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#fff]/5 flex items-center justify-center">
                            <Smartphone size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">Push Notifications</h3>
                            <p className="text-[12px] text-text-tertiary">Manage push notification settings directly on your iOS or Android device.</p>
                        </div>
                    </div>
                    <button className="text-[13px] font-semibold text-white hover:text-white/80 transition-colors cursor-pointer">Send Link to Phone</button>
                </div>
            </div>

        </div>
    );
}
