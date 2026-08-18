"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Verified } from "lucide-react";
import { getDomains, checkUsernameAvailability, Domain } from "@/lib/api/public";
import { registerUser, checkProvisioningStatus } from "@/lib/api/auth";
import { tokenManager, setupTokenRefresh, clearTokenRefresh } from "@/lib/token_manager";

const IosSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CreateAccount() {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [showProvisioningModal, setShowProvisioningModal] = useState(false);
  const [provisioningStatus, setProvisioningStatus] = useState<'provisioning' | 'success' | 'error'>('provisioning');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pass: string) => {
    if (!pass) return "";
    if (pass.length < 8) return "Must be at least 8 characters";
    if (!/[A-Z]/.test(pass)) return "Must contain at least one uppercase letter";
    if (!/[a-z]/.test(pass)) return "Must contain at least one lowercase letter";
    if (!/\d/.test(pass)) return "Must contain at least one number";
    if (!/[@$!%*?&]/.test(pass)) return "Must contain at least one symbol (e.g. @, #, $)";
    if (/\s/.test(pass)) return "Password cannot contain spaces";
    return "";
  };
  const [domain, setDomain] = useState("");
  const [domainsList, setDomainsList] = useState<Domain[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [pinCode, setPinCode] = useState("");
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load domains when modal opens
  useEffect(() => {
    if (showUsernameModal) {
      const loadDomains = async () => {
        setIsLoadingDomains(true);
        const domains = await getDomains();
        // Filter for active domains with registration enabled
        const activeDomains = domains.filter(d => d.status === 'active' && d.registration_enabled);
        setDomainsList(activeDomains);
        
        // Set default domain
        if (activeDomains.length > 0) {
          setDomain("@" + activeDomains[0].name);
        }
        setIsLoadingDomains(false);
      };
      
      loadDomains();
    }
  }, [showUsernameModal]);

  // Real username availability check using API
  useEffect(() => {
    if (!username || !domain) {
      setAvailabilityMessage("");
      setIsUsernameAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const domainName = domain.replace('@', '');
        const isAvailable = await checkUsernameAvailability(domainName, username);
        
        if (username.length < 3) {
          setAvailabilityMessage("Username must be at least 3 characters.");
          setIsUsernameAvailable(false);
        } else if (isAvailable) {
          setAvailabilityMessage("Username is available!");
          setIsUsernameAvailable(true);
        } else {
          setAvailabilityMessage("Username is already taken.");
          setIsUsernameAvailable(false);
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setAvailabilityMessage("Error checking availability.");
        setIsUsernameAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [username, domain]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDomainOpen(false);
      }
    };

    if (isDomainOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDomainOpen]);

  // Poll provisioning status every 3 seconds when modal is open
  useEffect(() => {
    if (showProvisioningModal && provisioningStatus === 'provisioning' && accessToken) {
      const pollStatus = async () => {
        const status = await checkProvisioningStatus(accessToken);
        
        if (status) {
          if (status.status === 'active' && status.ready_for_session) {
            setProvisioningStatus('success');
            // After showing success for 2 seconds, redirect to inbox
            setTimeout(() => {
              router.push("/app/inbox");
            }, 2000);
          }
        }
      };

      // Initial check
      pollStatus();

      // Set up polling every 3 seconds
      const intervalId = setInterval(pollStatus, 3000);

      return () => clearInterval(intervalId);
    }
  }, [showProvisioningModal, provisioningStatus, accessToken, router]);

  const handleSkipSocial = () => {
    setShowUsernameModal(true);
  };

  const handleRegister = async () => {
    if (!username || !domain || !password || passwordError || isUsernameAvailable === false) return;
    
    setIsPageLoading(true);

    // Call register API
    const email = `${username}${domain}`;
    const registerResponse = await registerUser(email, password);

    if (registerResponse) {
      // Clear any existing token refresh interval first
      clearTokenRefresh();
      
      // Store tokens with default expiration (15 minutes = 900 seconds)
      tokenManager.setTokens({
        access_token: registerResponse.access_token,
        refresh_token: registerResponse.refresh_token,
        id: registerResponse.id,
        email: registerResponse.email,
        expires_in: 900 // Default 15 minutes
      });

      // Setup automatic token refresh
      setupTokenRefresh();

      setAccessToken(registerResponse.access_token);

      // Show provisioning modal if status is pending
      if (registerResponse.status === 'pending') {
        setShowProvisioningModal(true);
        setProvisioningStatus('provisioning');
      } else {
        // If already active, go to inbox
        router.push("/app/inbox");
      }
    } else {
      alert("Registration failed. Please try again.");
    }

    setIsPageLoading(false);
  };

  return (
    <>
      {/* 1. Full Page Spinner */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-500">
          <div className="bg-transparent p-5 rounded-none shadow-2xl flex items-center justify-center">
            <IosSpinner className="w-9 h-9 text-white" />
          </div>
        </div>
      )}

      {/* 2. Provisioning Modal */}
      <AnimatePresence>
        {showProvisioningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md transition-all duration-300"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-none p-8 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center justify-center"
            >
              {provisioningStatus === 'provisioning' ? (
                <>
                

                  {/* Loading Spinner */}
                  <div className="mb-4">
                    <IosSpinner className="w-8 h-8 text-black" />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Setting up your mailbox</h3>
                  <p className="text-sm text-gray-600 text-center">We're preparing your email account. This usually takes a few seconds...</p>
                </>
              ) : (
                <>
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-none flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </motion.div>

                  {/* Success Text */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">You're all set!</h3>
                  <p className="text-sm text-gray-600 text-center">Your mailbox is ready. Redirecting to your inbox...</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="flex min-h-screen w-full bg-[#fff] p-2 md:p-6 items-center justify-center font-sans">

        {/* Main Container */}
        <div className="flex w-full max-w-[1440px] h-[calc(100vh-24px)] md:h-[calc(100vh-48px)] bg-white rounded-[32px] overflow-hidden relative">

          {/* Left Pane - Auth Form */}
          <div className="flex w-full lg:w-[45%] flex-col items-center justify-center p-8 md:p-12 relative z-20 bg-white overflow-hidden">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[380px] flex flex-col items-center text-center"
            >

              {/* Logo */}
              <div className="mb-10 flex items-center justify-center gap-3 text-[22px] font-medium tracking-tight text-gray-900">
                <img
                  src="/logo/logo-01.png"
                  alt="Norest Mail Logo"
                  className="h-7 w-auto object-contain invert"
                />
                Norest Mail
              </div>

              <AnimatePresence mode="wait">
                {!showUsernameModal ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center"
                  >
                    {/* Heading */}
                    <h1 className="mb-10 text-[28px] md:text-[32px] font-medium leading-[1.2] tracking-tight text-gray-900">
                      One inbox for focused communication, team collaboration, and complete email visibility.
                    </h1>

                    {/* Auth Buttons */}
                    <div className="w-full flex flex-col gap-3">
                      <button
                        onClick={handleSkipSocial}
                        className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-full bg-[#000] px-4 py-4 text-[15px] font-medium text-white transition-all hover:bg-black/80"
                      >
                        Create a new email address
                      </button>

                      <button
                        onClick={() => router.push('/account/create/custom-domain')}
                        className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-full bg-white border-2 border-gray-200 px-4 py-4 text-[15px] font-medium text-gray-800 transition-all hover:bg-gray-50 hover:border-gray-300"
                      >
                        Use your own custom domain
                      </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-12 text-[13px] text-gray-500 font-medium leading-relaxed">
                      By continuing, you agree to our<br />
                      <Link href="#" className="text-gray-900 underline underline-offset-2 hover:text-black">Terms of Service</Link> and <Link href="#" className="text-gray-900 underline underline-offset-2 hover:text-black">Privacy Policy.</Link>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex flex-col items-center"
                  >
                    <h1 className="mb-1 text-[24px] md:text-[26px] font-semibold text-gray-900">
                      Secure your username
                    </h1>
                    <p className="mb-8 text-[13px] text-gray-500 font-medium leading-relaxed">
                      Set up your primary Norest Mail address for your first mailbox.
                    </p>

                    <div className="w-full flex flex-col gap-6 text-left">
                      {/* Username + Domain Selection */}
                      <motion.div
                        initial={{ opacity: 1 }}
                        className="flex flex-col gap-6"
                      >
                            {/* Username Input Row */}
                            <div className="relative z-[70]">
                              <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-bold text-gray-700">Username</label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="flex-1 relative">
                                    <input
                                      type="text"
                                      placeholder="Enter username"
                                      value={username}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\s/g, '');
                                        setUsername(value);
                                      }}
                                      className={`w-full h-14 bg-transparent ${isUsernameAvailable === false ? 'border-b-2 border-red-400' : isUsernameAvailable === true ? 'border-b-2 border-blue-500' : 'border-b border-gray-200'} focus:border-b-2 focus:border-blue-500 rounded-none px-0 py-2 text-[14px] font-semibold placeholder:text-black/50 placeholder:font-medium text-gray-900 outline-none transition-all`}
                                    />
                                    {/* {isUsernameAvailable === true && (
                                      <div className="absolute right-0 top-1/2 -translate-y-1/2 text-black">
                                        <Verified className="text-[10px]" />
                                      </div>
                                    )} */}
                                  </div>
                                  <div className="relative w-full sm:w-[160px]" ref={dropdownRef}>
                                    <button
                                      type="button"
                                      onClick={() => setIsDomainOpen(!isDomainOpen)}
                                      className={`w-full h-14 bg-transparent border-b ${isDomainOpen ? 'border-b-2 border-gray-900' : 'border-gray-200'} hover:border-gray-400 rounded-none px-0 py-2 text-[13px] font-semibold text-gray-700 flex items-center justify-between transition-all cursor-pointer`}
                                    >
                                      <span className="truncate font-semibold">{domain.replace('@', '') || 'Domain'}</span>
                                      <motion.svg animate={{ rotate: isDomainOpen ? 180 : 0 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></motion.svg>
                                    </button>

                                    <AnimatePresence>
                                      {isDomainOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 4 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 4 }}
                                          transition={{ duration: 0.15 }}
                                          className="absolute right-0 top-[calc(100%+2px)] w-[200px] sm:w-[220px] bg-white border border-gray-200 rounded-lg overflow-hidden z-50"
                                        >
                                          {isLoadingDomains ? (
                                            <div className="px-4 py-3 text-[13px] font-semibold text-gray-600 flex items-center gap-2">
                                              <IosSpinner className="w-4 h-4" />
                                              Loading...
                                            </div>
                                          ) : domainsList.length > 0 ? (
                                            domainsList.map(d => (
                                              <button
                                                key={d.id}
                                                type="button"
                                                onClick={() => { setDomain("@" + d.name); setIsDomainOpen(false); }}
                                                className={`cursor-pointer w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all ${domain === "@" + d.name ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
                                              >
                                                @{d.name}
                                              </button>
                                            ))
                                          ) : (
                                            <div className="px-4 py-3 text-[13px] font-semibold text-gray-600">No domains available</div>
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </div>
                              <AnimatePresence>
                                {(availabilityMessage || isChecking) && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    className="mt-2 flex items-center gap-2"
                                  >
                                    {isChecking && <IosSpinner className="w-4 h-4 text-gray-400" />}
                                    {!isChecking && availabilityMessage && (
                                      <p className={`text-[12px] font-bold ${isUsernameAvailable === false ? 'text-red-600' : 'text-blue-600'}`}>
                                        {availabilityMessage}
                                      </p>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Invite Pin Code Field (only for norest.in) */}
                            <AnimatePresence>
                              {domain === "@norest.in" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold text-gray-700">Invite Code</label>
                                    <div className="flex justify-between gap-2">
                                      {Array.from({ length: 8 }).map((_, i) => (
                                        <input
                                          key={i}
                                          ref={(el) => {
                                            pinInputRefs.current[i] = el;
                                          }}
                                          type="text"
                                          maxLength={1}
                                          value={pinCode[i] || ""}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const newPin = pinCode.split("");
                                            newPin[i] = val;
                                            setPinCode(newPin.join(""));
                                            if (val && i < 7) {
                                              pinInputRefs.current[i + 1]?.focus();
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !pinCode[i] && i > 0) {
                                              pinInputRefs.current[i - 1]?.focus();
                                            }
                                          }}
                                          onPaste={(e) => {
                                            e.preventDefault();
                                            const pasted = e.clipboardData.getData("text").slice(0, 8);
                                            setPinCode(pasted);
                                            pinInputRefs.current[Math.max(0, Math.min(pasted.length - 1, 7))]?.focus();
                                          }}
                                          className="flex-1 w-full h-14 bg-transparent border-b border-gray-200 text-center text-[18px] font-semibold text-gray-900 outline-none focus:border-b-2 focus:border-blue-500 rounded-none transition-all"
                                        />
                                      ))}
                                    </div>
                                    <p className="text-[12px] text-gray-600 font-semibold leading-relaxed">
                                      Note: The <span className="text-gray-800 font-bold">{domain}</span> domain is invite-only and requires an 8-character code.
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Password Field */}
                            <div>
                              <div className="flex flex-col gap-2">
                                <label className="text-[12px] font-bold text-gray-700">Password</label>
                                <div className="relative">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a strong password"
                                    value={password}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\s/g, '');
                                      setPassword(val);
                                      setPasswordError(validatePassword(val));
                                    }}
                                    className={`w-full h-14 bg-transparent ${passwordError ? 'border-b-2 border-red-400 focus:border-red-500' : 'border-b border-gray-200 focus:border-b-2 focus:border-blue-500'} rounded-none px-0 pr-10 py-2 text-[14px] font-semibold placeholder:text-black/50 placeholder:font-medium text-gray-900 outline-none transition-all`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    {showPassword ? <FaEyeSlash className="text-[18px]" /> : <FaEye className="text-[18px]" />}
                                  </button>
                                </div>
                                <AnimatePresence>
                                  {passwordError && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      className="mt-1"
                                    >
                                      <p className="text-[12px] font-semibold text-red-600">
                                        {passwordError}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {/* Register Button */}
                            <div className="flex flex-col gap-3 mt-8 relative z-[60]">
                              <button
                                onClick={handleRegister}
                                disabled={isPageLoading || !username || !domain || !password || !!passwordError || (() => {
                                  const selectedDomainObj = domainsList.find(d => "@" + d.name === domain);
                                  return selectedDomainObj?.name === "norest.in" && pinCode.length !== 8;
                                })() || isUsernameAvailable === false}
                                className="cursor-pointer w-full h-12 bg-black text-white font-semibold text-[15px] hover:bg-black/90 transition-colors rounded-full flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                              >
                                {isPageLoading && <IosSpinner className="w-4 h-4 text-white" />}
                                {isPageLoading ? "Creating account..." : "Complete Registration"}
                              </button>
                              <button
                                onClick={() => router.push("/account/create/custom-domain/config")}
                                className="cursor-pointer w-full h-12 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-[15px] hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-full"
                              >
                                Connect custom domain
                              </button>
                            </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>

          {/* Right Pane - Visuals & Gradient */}
          <div className="relative hidden w-[55%] lg:flex items-center justify-center m-3 ml-0 rounded-[24px] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full bg-gray-900 rounded-[24px] overflow-hidden relative flex items-center justify-center"
            >
              {/* Background Image */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute inset-[-5%] w-[110%] h-[110%] bg-cover bg-center blur-sm"
                  style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1711987596276-330281dfa17f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTgwfHxzY2VuZXJ5JTIwcGFpbnR8ZW58MHx8MHx8fDA%3D')" }}
                ></div>
                <div className="absolute inset-0 bg-black/70 mix-blend-overlay"></div>
              </div>

              <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-12">
                {/* Top Badge */}
                <div className="flex flex-col items-center mt-6">
                  <div className="flex items-center gap-3 text-[26px] font-bold text-white">
                    60K+ users worldwide
                  </div>
                  <p className="text-[13px] text-white/80 font-medium max-w-[280px] text-center mt-2 leading-tight">
                    A Norest Corporation product, seamlessly connecting thousands.
                  </p>
                </div>

                {/* Center Feature Mockup */}
                <div className="relative w-full flex-1 flex flex-col items-center justify-center my-6 px-8 lg:px-12 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full text-center mb-8 max-w-[380px]"
                  >
                    <h2 className="text-[26px] font-bold text-white mb-4 tracking-tight">Never miss a follow-up</h2>
                    <p className="text-[16px] text-white/80 leading-relaxed font-medium">
                      Norest Mail automatically brings unanswered conversations back at the right time, so important replies never disappear inside your inbox.
                    </p>
                  </motion.div>

                  {/* UI Mockup Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-full max-w-[380px] bg-white/20 backdrop-blur-md rounded-[24px] p-6 shadow-sm border border-white/30 relative z-10"
                  >
                    <div className="w-full bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-6 relative border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                        <span className="text-[14px] font-bold text-gray-900">Follow-up</span>
                      </div>
                      <h3 className="text-[20px] font-bold text-gray-800 mb-10">Partnership proposal</h3>
                      {/* Floating 'Remind me' element */}
                      <div className="absolute -bottom-6 left-6 right-6 bg-white rounded-[16px] shadow-[0_16px_50px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between border border-gray-50 z-20">
                        <span className="text-[16px] font-medium text-gray-800">Remind me</span>
                        <div className="bg-[#f8f9fa] px-3 py-2 rounded-[10px] text-[13px] font-semibold text-gray-900 text-center leading-snug">
                          Tomorrow,<br />9:00 AM
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Stats */}
                <div className="flex gap-12 text-[18px] font-medium text-white/80 mb-6 z-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[22px] font-bold text-white">40k+</span>
                    <span className="text-[14px]">teams</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[22px] font-bold text-white">20k+</span>
                    <span className="text-[14px]">individuals</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[22px] font-bold text-white">99%</span>
                    <span className="text-[14px]">uptime</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
