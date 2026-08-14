"use client";

import { useState, useEffect } from "react";
import { Check, Copy, MoreVertical, ShieldCheck, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

const providers = ["Cloudflare", "GoDaddy", "Namecheap", "Hostinger"];

export default function DNSConfigPage() {
    const router = useRouter();
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const [isVerifying, setIsVerifying] = useState(true);
    const [isCheckingManual, setIsCheckingManual] = useState(false);
    const [showPropagationMessage, setShowPropagationMessage] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isVerified, setIsVerified] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    useEffect(() => {
        // Initial verification
        const initialTimer = setTimeout(() => {
            setIsVerifying(false);
        }, 5000);

        // Loop every 30 seconds
        const interval = setInterval(() => {
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);
            }, 5000);
        }, 30000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

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
            if (clickCount >= 1) {
                setIsVerified(true);
            } else {
                setClickCount(prev => prev + 1);
                setShowPropagationMessage(true);
            }
        }, 1500);
    };

    const handleGoToMailbox = () => {
        setIsLaunching(true);
        setTimeout(() => {
            router.push("/app");
        }, 1000);
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col bg-black text-white p-8 md:p-16 font-sans overflow-hidden"
            animate={isLaunching ? { opacity: 0, x: 150 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: "easeIn" }}
        >
            <div className="max-w-[1000px] w-full mx-auto md:flex md:flex-col md:h-full">
                {/* Logo */}
                <motion.div
                    className="mb-10 flex items-center gap-3 text-[22px] font-medium tracking-tight text-white shrink-0 origin-left"
                    animate={isLaunching ? {
                        x: [0, -6, 6, -8, 8, -10, 10, -5, 0, 2500],
                        opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                        scale: [1, 1, 1, 1, 1, 1, 1, 1, 1.2, 1.8]
                    } : {}}
                    transition={{
                        duration: 0.8,
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
                        ease: "easeIn"
                    }}
                >
                    <img
                        src="/logo/logo-01.png"
                        alt="Norest Mail Logo"
                        className="h-7 w-auto object-contain brightness-0 invert"
                    />
                    Norest Mail
                </motion.div>

                {/* Header */}
                <div className="mb-8 shrink-0">
                    <h1 className="text-3xl font-medium tracking-tight mb-3 text-white">Configure DNS for <span className="text-white font-bold">@theripun.com</span></h1>
                    <p className="text-white/50 text-[15px]">Required Records to start sending and receiving emails.</p>
                </div>

                {/* Table - Fully expanded */}
                <div className="mb-8 w-full overflow-x-auto pr-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[10%]">Type</th>
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[20%]">Host</th>
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[30%]">Value</th>
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[10%]">Priority</th>
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[10%]">Status</th>
                                <th className="py-4 px-4 font-normal text-white/50 text-[13px] w-[20%] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dnsRecords.map((record) => (
                                <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-white/10 border border-white/10 text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                                                {record.type}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-white/90 font-mono">
                                        {record.host}
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-white/90 font-mono truncate max-w-[200px]" title={record.value}>
                                        {record.value}
                                    </td>
                                    <td className="py-4 px-4 text-[14px] text-white/50">
                                        {record.priority}
                                    </td>
                                    <td className="py-4 px-4 text-[14px]">
                                        {isVerifying ? (
                                            <div className="flex items-center gap-2 text-white/60">
                                                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-white/90 animate-in fade-in zoom-in duration-300">
                                                <div className="bg-white text-black rounded-full p-0.5 shadow-sm">
                                                    <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-right flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleCopy(record.host, `host-${record.id}`)}
                                            className="text-[12px] font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 border border-white/10 shadow-sm px-2.5 py-1 rounded-md"
                                        >
                                            {copiedStates[`host-${record.id}`] ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                                            Host
                                        </button>
                                        <button
                                            onClick={() => handleCopy(record.value, `value-${record.id}`)}
                                            className="text-[12px] font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1.5 bg-white/10 border border-white/10 shadow-sm px-2.5 py-1 rounded-md"
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

                {/* Action Button */}
                <div className="flex flex-col gap-3 border-t border-white/10 pt-6 shrink-0 pb-12 relative z-10">
                    <AnimatePresence mode="wait">
                        {!isVerified ? (
                            <motion.div key="check" className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <button
                                    onClick={handleCheckVerified}
                                    disabled={isCheckingManual}
                                    className="cursor-pointer bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-medium text-[14px] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isCheckingManual ? <IosSpinner className="w-4 h-4 text-black" /> : <ShieldCheck className="w-4 h-4" />}
                                    {isCheckingManual ? "Checking..." : "I've Added These Records"}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="success" className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <button
                                    onClick={handleGoToMailbox}
                                    className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-full font-medium text-[14px] transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                >
                                    Go to mailbox →
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showPropagationMessage && !isVerified && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[13.5px] text-rose-500 font-medium bg-rose-500/10 border border-yellow-500/20 px-4 py-3 rounded-lg w-fit mt-2"
                            >
                                DNS records may take up to 24-48 hours to propagate globally. We will keep checking in the background.
                            </motion.div>
                        )}
                        {/* {isVerified && (
                            <motion.div 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[13.5px] text-blue-400 font-medium bg-blue-500/10 border border-blue-500/20 px-4 py-3 rounded-lg w-fit mt-2 flex items-center gap-2"
                            >
                                <CheckCheck className="w-4 h-4" />
                                DNS verified successfully! Your custom domain is ready.
                            </motion.div>
                        )} */}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
