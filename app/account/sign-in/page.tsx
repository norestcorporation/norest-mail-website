"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "@/lib/api/auth";
import { saveTokens, setupTokenRefresh, clearTokenRefresh } from "@/lib/token_manager";

const IosSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SignIn() {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setIsLoggingIn(true);
    setError("");

    try {
      const response = await loginUser({
        email: email,
        password: password
      });

      if (response) {
        // Clear any existing token refresh interval first
        clearTokenRefresh();
        
        // Save tokens using the new format with expiration
        saveTokens(
          response.access_token,
          response.refresh_token,
          response.expires_in,
          response.id,
          response.email
        );

        // Setup automatic token refresh
        setupTokenRefresh();

        setIsPageLoading(true);
        
        // Redirect to inbox
        router.push("/app/inbox");
      } else {
        throw new Error("Login failed - no response from server");
      }
    } catch (e: any) {
      console.error('Login error details:', e);
      setError(e.message || "Invalid email or password");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    setIsSubmittingForgot(true);
    setError("");
    setForgotPasswordSuccess(false);

    try {
      // Mock implementation - simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setForgotPasswordSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to request password reset");
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  return (
    <>
      {isPageLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-500">
          <div className="bg-transparent p-5 rounded-[20px] shadow-2xl flex items-center justify-center">
            <IosSpinner className="w-9 h-9 text-white" />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full bg-[#fff] p-2 md:p-6 items-center justify-center font-sans">
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
                  className="h-7 w-auto object-contain brightness-0"
                />
                Norest Mail
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <h1 className="mb-2 text-[28px] md:text-[32px] font-medium leading-[1.2] tracking-tight text-gray-900">
                  {isForgotPasswordMode ? "Reset your password" : "Welcome back"}
                </h1>
                <p className="mb-10 text-[14px] text-black font-medium leading-relaxed">
                  {isForgotPasswordMode 
                    ? "Enter your email address and we'll send you a link to reset your password." 
                    : "Sign in to your Norest Mail account."}
                </p>

                <div className="w-full flex flex-col gap-5 text-left">
                  {/* Email Input */}
                  <div className="relative z-[70]">
                    <label className="block text-[13px] font-bold text-gray-900 mb-2">Email Address</label>
                    <div className="flex w-full items-center bg-[#fff] border border-black/5 rounded-[14px] transition-colors h-[52px] focus-within:bg-[#fff]">
                      <input
                        type="email"
                        placeholder="you@norestmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                        className="w-full h-full bg-transparent font-bold placeholder:font-medium px-4 text-[14px] outline-none placeholder:text-gray-400 transition-colors text-gray-900"
                        onKeyDown={(e) => e.key === 'Enter' && (isForgotPasswordMode ? handleForgotPassword() : handleSignIn())}
                      />
                    </div>
                  </div>

                  {!isForgotPasswordMode && (
                    <>
                      {/* Password Field */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[13px] font-bold text-gray-900">Password</label>
                          <button 
                            type="button" 
                            onClick={() => { setIsForgotPasswordMode(true); setError(""); setForgotPasswordSuccess(false); }}
                            className="text-[12px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            Forgot?
                          </button>
                        </div>
                        <div className="relative flex items-center w-full">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\s/g, '');
                              setPassword(val);
                            }}
                            className="w-full h-[52px] bg-[#fff] border border-black/5 focus:border-black/20 rounded-[14px] px-4 pr-12 text-[14px] font-bold placeholder:font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400"
                            onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 cursor-pointer text-black hover:opacity-70 transition-opacity"
                          >
                            {showPassword ? <FaEyeSlash className="text-[18px]" /> : <FaEye className="text-[18px]" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1"
                      >
                        <p className="text-[13px] font-bold text-red-700">
                          {error}
                        </p>
                      </motion.div>
                    )}
                    {forgotPasswordSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-1 p-3 bg-green-50 border border-green-200 rounded-[10px]"
                      >
                        <p className="text-[13px] text-green-800 font-medium">
                          If an account exists with that email, we have sent a password reset link.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mt-4 relative z-[60]">
                    {isForgotPasswordMode ? (
                      <>
                        <button
                          onClick={handleForgotPassword}
                          disabled={isSubmittingForgot || !email}
                          className="cursor-pointer w-full h-[52px] bg-[#09090b] text-white font-semibold text-[15px] hover:bg-black transition-all rounded-[14px] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmittingForgot ? <IosSpinner className="w-[18px] h-[18px] text-white" /> : null}
                          {isSubmittingForgot ? "Sending link..." : "Send Reset Link"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsForgotPasswordMode(false); setError(""); }}
                          className="cursor-pointer w-full h-[52px] bg-[#f4f4f5] text-gray-800 font-semibold text-[15px] hover:bg-[#e4e4e7] transition-all rounded-[14px]"
                        >
                          Back to Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleSignIn}
                          disabled={isLoggingIn || !email || !password}
                          className="cursor-pointer w-full h-[52px] bg-[#09090b] text-white font-semibold text-[15px] hover:bg-black transition-all rounded-[14px] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isLoggingIn ? <IosSpinner className="w-[18px] h-[18px] text-white" /> : null}
                          {isLoggingIn ? "Signing in..." : "Sign In"}
                        </button>
                        
                        <div className="mt-4 text-center">
                          <p className="text-[13px] text-gray-500 font-medium">
                            Don't have an account?{" "}
                            <Link href="/account/create" className="text-gray-900 font-bold hover:underline underline-offset-2">
                              Create one
                            </Link>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Pane - Visuals */}
          <div className="relative hidden w-[55%] lg:flex items-center justify-center m-3 ml-0 rounded-[24px] overflow-hidden">
            <motion.div
              key="visuals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
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
