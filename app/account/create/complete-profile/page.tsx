"use client";
import React, { useState } from "react";
import { FaCamera, FaEye, FaEyeSlash, FaCheck, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const IosSpinner = ({ className = "w-5 h-5" }) => (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function CompleteProfile() {
    const router = useRouter();
    const [isCompletingSetup, setIsCompletingSetup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [enable2FA, setEnable2FA] = useState(true);
    const [signature, setSignature] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [profilePictureURL, setProfilePictureURL] = useState("");
    const [language, setLanguage] = useState("en-US");
    const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
    
    const [email, setEmail] = useState("");
    const [storedPassword, setStoredPassword] = useState("");
    const [token, setToken] = useState("");

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const username = localStorage.getItem("reservedUsername");
            const domain = localStorage.getItem("reservedDomain");
            if (username && domain) {
                setEmail(`${username}@${domain}`);
            }
            const pass = localStorage.getItem("registeredPassword") || localStorage.getItem("pendingPassword");
            if (pass) setStoredPassword(pass);
            const t = localStorage.getItem("accessToken");
            if (t) setToken(t);
        }
    }, []);

    const timezones = [
        "America/New_York",
        "America/Los_Angeles",
        "Pacific Time (PT)",
        "Eastern Time (ET)",
        "Coordinated Universal Time (UTC)",
        "Central European Time (CET)",
        "Indian Standard Time (IST)"
    ];

    const handleCompleteSetup = async () => {
        setIsCompletingSetup(true);
        try {
            // Mock implementation - simulate profile update
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push("/app");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
            setIsCompletingSetup(false);
        }
    };

    return (
        <>
            {/* Full Page Spinner */}
            {isCompletingSetup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-500">
                    <div className="bg-transparent p-5 rounded-[20px] shadow-2xl flex items-center justify-center border border-gray-100">
                        <IosSpinner className="w-9 h-9 text-white" />
                    </div>
                </div>
            )}

            <div className="flex min-h-screen lg:h-screen lg:overflow-hidden w-full bg-white font-sans text-gray-900 items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-[1000px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-20">

                    {/* Header Section */}
                    <div className="flex-1 text-left lg:pt-10 w-full max-w-[420px]">
                        {/* Logo */}
                        <div className="mb-10 flex items-center justify-start gap-3 text-[22px] font-medium tracking-tight text-gray-900">
                            <img
                                src="/logo/logo-01.png"
                                alt="Norest Mail Logo"
                                className="h-7 w-auto object-contain brightness-0"
                            />
                            Norest Mail
                        </div>

                        <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-tight text-gray-900 mb-4">
                            One last step,
                            <br /> complete your profile
                        </h1>
                        <p className="text-[16px] text-gray-500 font-medium leading-relaxed mb-10">
                            Please provide the necessary details below to finalize your account setup and get started.
                        </p>

                        {/* Chosen Account Details (Clean, no borders/shadows) */}
                        <div className="bg-gray-50 rounded-[16px] p-6">
                            <div className="mb-5">
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Your Email</label>
                                <div className="text-[17px] font-semibold text-gray-900">{email || "loading..."}</div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-gray-500 mb-1">Password</label>
                                <div className="flex items-center gap-4">
                                    <div className="text-[20px] font-semibold text-gray-900 tracking-widest mt-1 flex-1">
                                        {showPassword ? (
                                            <span className="tracking-normal text-[17px]">{storedPassword || "SecretPassword123!"}</span>
                                        ) : (
                                            "••••••••••••"
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="cursor-pointer text-gray-400 hover:text-black transition-colors p-2"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* 2FA Checkbox Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <label
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setEnable2FA(!enable2FA)}
                                >
                                    <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors ${enable2FA ? 'bg-[#09090b]' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                                        {enable2FA && <FaCheck className="text-white text-[10px]" />}
                                    </div>
                                    <span className="text-[14px] font-semibold text-gray-900">Enable Two-Factor Authentication (2FA)</span>
                                </label>
                                <p className="text-[13px] text-gray-500 mt-2 pl-8">
                                    Protect your account with an extra layer of security.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Container (Clean look: no shadows, no borders) */}
                    <div className="w-full max-w-[420px] bg-transparent lg:pt-12 shrink-0">

                        <div className="flex flex-col gap-5">

                            {/* Profile Picture */}
                            <div className="flex flex-col items-center justify-center mb-1">
                                <div className="relative w-[96px] h-[96px] rounded-full bg-[#0a0a0a] flex items-center justify-center text-white cursor-pointer hover:bg-black/90 transition-colors group overflow-hidden">
                                    {profilePictureURL ? (
                                        <img src={profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaCamera className="text-[26px] group-hover:scale-110 transition-transform" />
                                    )}
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Image URL" 
                                    value={profilePictureURL}
                                    onChange={(e) => setProfilePictureURL(e.target.value)}
                                    className="mt-3 text-[12px] bg-[#f9fafb] border border-gray-200 rounded px-2 py-1 outline-none w-[150px] text-center"
                                />
                                <span className="mt-1 text-[12px] font-bold text-[#6b7280] uppercase tracking-wider">Upload Photo</span>
                            </div>

                            {/* Display Name */}
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2">Display Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full bg-[#f9fafb] h-[52px] rounded-[12px] px-4 text-[15px] text-[#111827] font-medium outline-none focus:bg-[#f3f4f6] transition-colors placeholder:text-[#9ca3af]"
                                />
                            </div>

                            {/* Time Zone */}
                            <div className="relative">
                                <label className="block text-[14px] font-bold text-[#111827] mb-2">Time Zone</label>
                                <div
                                    onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                                    className="w-full bg-[#f9fafb] h-[52px] rounded-[12px] px-4 text-[15px] text-[#111827] font-medium flex items-center justify-between cursor-pointer hover:bg-[#f3f4f6] transition-colors"
                                >
                                    {selectedTimezone}
                                    <FaChevronDown className={`text-[12px] text-[#9ca3af] transition-transform ${isTimezoneOpen ? "rotate-180" : ""}`} />
                                </div>

                                <AnimatePresence>
                                    {isTimezoneOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 py-1"
                                        >
                                            {timezones.map((tz) => (
                                                <div
                                                    key={tz}
                                                    onClick={() => {
                                                        setSelectedTimezone(tz);
                                                        setIsTimezoneOpen(false);
                                                    }}
                                                    className={`px-4 py-3 text-[14px] font-medium cursor-pointer transition-colors ${selectedTimezone === tz ? "bg-gray-50 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
                                                >
                                                    {tz}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Signature */}
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2">Signature Style</label>
                                <input
                                    type="text"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    placeholder="Type your signature..."
                                    className="w-full bg-[#f9fafb] h-[52px] rounded-[12px] px-4 text-[15px] text-[#111827] font-medium outline-none focus:bg-[#f3f4f6] transition-colors mb-3 placeholder:text-[#9ca3af]"
                                />
                                <div className="w-full bg-[#f9fafb] rounded-[16px] p-6 flex items-center justify-center overflow-hidden h-[110px]">
                                    <span
                                        className="text-[42px] text-[#111827] leading-none"
                                        style={{ fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive" }}
                                    >
                                        {signature || "Your Signature"}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleCompleteSetup}
                                disabled={isCompletingSetup}
                                className="w-full h-[56px] bg-[#0a0a0a] text-white font-semibold text-[16px] rounded-[16px] hover:bg-black/90 cursor-pointer transition-all flex justify-center items-center mt-3 gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCompletingSetup ? <IosSpinner className="w-5 h-5 text-white" /> : null}
                                {isCompletingSetup ? "Setting up..." : "Complete Setup"}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
