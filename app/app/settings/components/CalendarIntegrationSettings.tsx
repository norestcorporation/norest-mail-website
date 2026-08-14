"use client";

import React, { useState } from 'react';
import { Calendar, Globe, Clock, Bell, Link2, Plus, Unplug } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function CalendarIntegrationSettings() {
    const [eventNotifications, setEventNotifications] = useState(true);
    const [timeZone, setTimeZone] = useState("(GMT-08:00) Pacific Time (US & Canada)");
    const [eventDuration, setEventDuration] = useState("30 minutes");
    const [startTime, setStartTime] = useState("9:00 AM");
    const [endTime, setEndTime] = useState("5:00 PM");

    return (
        <div className="flex flex-col gap-8">
            
            {/* Connected Calendars */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">Connected Calendars</h2>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-[13px] font-semibold text-white transition-colors cursor-pointer">
                        <Plus size={14} /> Connect Calendar
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#000] rounded-xl p-5 border border-[#fff]/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#fff]/5 flex items-center justify-center">
                                <Calendar size={16} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-semibold text-white">Google Calendar</h3>
                                <p className="text-[12px] text-text-tertiary">ripun@gmail.com</p>
                            </div>
                        </div>
                        <button className="text-text-tertiary hover:text-red-500 transition-colors" title="Disconnect">
                            <Unplug size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Default Settings */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Calendar Settings</h2>
                <div className="bg-[#000] rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Globe size={14} /> Time Zone
                            </label>
                            <CustomDropdown options={["(GMT-08:00) Pacific Time (US & Canada)", "(GMT-05:00) Eastern Time (US & Canada)", "(GMT+00:00) London", "(GMT+01:00) Central European Time"]} value={timeZone} onChange={setTimeZone} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Clock size={14} /> Default Event Duration
                            </label>
                            <CustomDropdown options={["15 minutes", "30 minutes", "45 minutes", "60 minutes"]} value={eventDuration} onChange={setEventDuration} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] text-text-secondary font-semibold flex items-center gap-2">
                                <Link2 size={14} /> Default Meeting Link
                            </label>
                            <input 
                                type="url" 
                                placeholder="e.g. https://zoom.us/j/123456789" 
                                defaultValue="https://meet.google.com/abc-defg-hij"
                                className="bg-[#fff]/5 text-white text-[14px] rounded-lg px-4 py-2.5 outline-none font-semibold w-full" 
                            />
                            <p className="text-[12px] text-text-tertiary">Automatically add this link to events you create.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Working Hours & Notifications */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Working Hours & Notifications</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Clock size={16} className="text-text-secondary" />
                                Working Hours
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Warn people if they invite you outside these hours.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-28">
                                <CustomDropdown options={["8:00 AM", "9:00 AM", "10:00 AM"]} value={startTime} onChange={setStartTime} />
                            </div>
                            <span className="text-text-tertiary">to</span>
                            <div className="w-28">
                                <CustomDropdown options={["4:00 PM", "5:00 PM", "6:00 PM"]} value={endTime} onChange={setEndTime} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Bell size={16} className="text-text-secondary" />
                                Event Notifications (Email)
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Receive emails for new invitations, updates, and cancellations.</p>
                        </div>
                        <div 
                            onClick={() => setEventNotifications(!eventNotifications)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${eventNotifications ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${eventNotifications ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
