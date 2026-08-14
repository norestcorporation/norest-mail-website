"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomDropdown({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-[#fff]/5 text-white text-[13px] rounded-lg px-4 py-2.5 outline-none font-medium cursor-pointer border border-[#fff]/5 focus:border-[#444] transition-colors"
            >
                {value}
                <ChevronDown size={14} className={`text-text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#fff]/5 rounded-lg shadow-xl overflow-hidden py-1"
                    >
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => { onChange(option); setIsOpen(false); }}
                                className="w-full text-left px-4 py-2 text-[13px] text-white hover:bg-[#333] transition-colors font-medium"
                            >
                                {option}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
