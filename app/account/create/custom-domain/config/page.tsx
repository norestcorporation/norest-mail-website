"use client";

import { Globe, Globe2, Copy, Check, ArrowRight, BarChart2, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function ConfigPage() {
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleVerifyAction = () => {
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-sans p-6 text-white">

            {/* Background Image with Blur */}
            <div
                className="absolute inset-[-5%] bg-cover bg-center blur-sm z-0"
                style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1719261426279-030d2f352275?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D')` }}
            ></div>
            <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                {/* Logo */}
                <div className="mb-10 flex items-center justify-center gap-3 text-[22px] font-medium tracking-tight text-white">
                    <img
                        src="/logo/logo-01.png"
                        alt="Norest Mail Logo"
                        className="h-7 w-auto object-contain brightness-0 invert"
                    />
                    Norest Mail
                </div>
                <h1 className="text-5xl md:text-[4.5rem] font-serif text-white tracking-tight leading-[1.05] mb-6">
                    Power Your Brand with Your Domain<span className="opacity-80">`</span>
                </h1>
                <p className="text-white text-lg md:text-[1.1rem] max-w-2xl mb-10 font-medium">
                    Strengthen your brand with custom email addresses powered by your own domain and managed by Norest Mail.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 w-full justify-center">
                    <div className="flex items-center bg-black/5 backdrop-blur-sm border-2 border-white/10 rounded-full overflow-hidden py-1.5 pl-5 pr-1.5 w-full max-w-lg focus-within:border-white/10 focus-within:bg-black/10 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.1)]">

                        <input
                            type="text"
                            placeholder="yourdomain.com"
                            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-[15px] font-medium text-white placeholder:text-white/40"
                            pattern="^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$"
                        />
                        <button
                            onClick={(e) => { e.preventDefault(); setShowVerifyModal(true); }}
                            className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-full font-semibold text-[14px] hover:bg-white/80 transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm mr-0"
                        >
                            Verify Domain Ownership <span className="text-[12px] font-black leading-none">›</span>
                        </button>
                    </div>
                </div>

                <p className="text-[13px] text-white/70 flex items-center gap-1.5 font-medium">
                    <span className="text-[16px] leading-none mb-0.5">✻</span> No credit card required. <span className="font-bold text-white">Free 1 month trial</span>
                </p>
            </div>
            {/* Modal Overlay */}
            {showVerifyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blurred background overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                        onClick={() => setShowVerifyModal(false)}
                    ></div>
                    {/* Modal Content - Ultra Compact */}
                    <div className="relative bg-black backdrop-blur-sm w-full max-w-[640px] rounded-[24px] p-5 shadow-2xl overflow-hidden font-sans text-white  animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2.5">

                                <h2 className="text-[15px] font-bold text-white">Verify Domain</h2>
                            </div>
                            <button onClick={() => setShowVerifyModal(false)} className="cursor-pointer text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 text-[16px] leading-none">
                                ✕
                            </button>
                        </div>

                        <p className="text-white text-[12px] mb-5 leading-relaxed">
                            Add this TXT record to your DNS provider.
                        </p>

                        {/* DNS Record Details - Table Layout */}
                        <div className="mb-6 w-full border-t border-b border-white/10 py-2">
                            <table className="w-full text-left text-[13px]">
                                <tbody>
                                    <tr className="border-b border-white/5">
                                        <th className="py-3 font-normal text-white/60 w-1/4">Type</th>
                                        <td className="py-3 font-bold text-white">TXT</td>
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <th className="py-3 font-normal text-white/60">Host</th>
                                        <td className="py-3 font-bold text-white">@</td>
                                    </tr>
                                    <tr>
                                        <th className="py-3 font-normal text-white/60 align-top">Value</th>
                                        <td className="py-3 font-bold text-white font-mono break-all pr-6 relative">
                                            norest-verification=aj7fd8fgudgfd88678fjkbjkbdf
                                            <button
                                                onClick={handleCopy}
                                                className="cursor-pointer absolute right-0 top-3 text-white/40 hover:text-white transition-colors"
                                            >
                                                {isCopied ? <Check className="w-4 h-4 text-white animate-in zoom-in duration-200" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={isVerified ? () => setShowVerifyModal(false) : handleVerifyAction}
                            disabled={isVerifying}
                            className={`w-full py-3 cursor-pointer rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${isVerified
                                ? "bg-white text-black hover:bg-gray-100"
                                : "bg-white text-black hover:bg-white/80"
                                }`}
                        >
                            {isVerifying ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </span>
                            ) : isVerified ? (
                                <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                    <div className="bg-black text-white rounded-full p-0.5 mr-4 shadow-sm ">
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                    </div>
                                    Continue configuration...
                                </span>
                            ) : (
                                "Verify Ownership"
                            )}
                        </button>

                        {/* Status Footer */}
                        {!isVerified && (
                            <div className="flex justify-between items-center text-[11px] mt-5 px-1">
                                <span className="text-white font-medium flex items-center gap-1.5"><span className="w-2 h-2 rounded-none bg-white animate-ping mr-2"></span> Never checked</span>
                                <span className="text-white font-medium">Please keep this open until we verify your domain.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
