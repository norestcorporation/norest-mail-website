"use client";

import React, { useState } from 'react';
import { Terminal, Database, ServerCrash, RefreshCw, HardDrive, Trash2 } from 'lucide-react';
import { CustomDropdown } from './CustomDropdown';

export function AdvancedSettings() {
    const [debugMode, setDebugMode] = useState(false);
    const [hardwareAccel, setHardwareAccel] = useState(true);
    const [cacheSize, setCacheSize] = useState('1 GB (Default)');

    return (
        <div className="flex flex-col gap-8">

            {/* System Performance */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">System Performance</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <HardDrive size={16} className="text-text-secondary" />
                                Hardware Acceleration
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Use GPU for rendering animations and complex UI elements.</p>
                        </div>
                        <div
                            onClick={() => setHardwareAccel(!hardwareAccel)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${hardwareAccel ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${hardwareAccel ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Database size={16} className="text-text-secondary" />
                                Offline Cache Size
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Amount of storage to use for caching emails offline (IndexedDB).</p>
                        </div>
                        <CustomDropdown options={["500 MB", "1 GB (Default)", "2 GB", "5 GB"]} value={cacheSize} onChange={setCacheSize} />
                    </div>
                </div>
            </div>

            {/* Developer & Troubleshooting */}
            <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Troubleshooting</h2>
                <div className="bg-[#000] rounded-xl p-2">
                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <Terminal size={16} className="text-text-secondary" />
                                Debug Mode
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Show advanced network logs and API timings in the console.</p>
                        </div>
                        <div
                            onClick={() => setDebugMode(!debugMode)}
                            className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative ${debugMode ? 'bg-blue-600' : 'bg-[#333]'}`}
                        >
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${debugMode ? 'translate-x-5' : 'translate-x-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border-b border-[#fff]/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <RefreshCw size={16} className="text-text-secondary" />
                                Rebuild Index
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Force a complete rebuild of the local search index if search is missing results.</p>
                        </div>
                        <button className="text-[12px] font-semibold text-white bg-[#fff]/5 hover:bg-[#fff]/10 px-3 py-1.5 rounded transition-colors cursor-pointer">
                            Rebuild Now
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                                <ServerCrash size={16} className="text-text-secondary" />
                                Clear Local Cache
                            </h3>
                            <p className="text-[12px] text-text-tertiary">Delete all offline data. You will need to re-download emails.</p>
                        </div>
                        <button className="text-[12px] font-semibold text-red-500 hover:text-white hover:bg-red-600 border border-red-500 hover:border-red-600 px-3 py-1.5 rounded transition-colors cursor-pointer">
                            Clear Cache
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="flex flex-col gap-4 mt-4">
                <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
                <div className="bg-[#110000] border border-red-900/50 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-semibold text-white">Delete Account</h3>
                        <p className="text-[13px] text-white">Permanently delete your account, all emails, aliases, and settings. This action cannot be undone.</p>
                    </div>
                    <button className="flex items-center gap-2 text-[13px] font-semibold text-white bg-red-700 hover:bg-red-800 px-4 py-2.5 rounded-lg transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                        <Trash2 size={16} /> Delete Account
                    </button>
                </div>
            </div>

        </div>
    );
}
