"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaApple, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaGooglePay } from "react-icons/fa";
import { SiStripe } from "react-icons/si";

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  storageQuota: number;
  mailboxLimit: number;
  features: string[];
  isPublic: boolean;
}

interface PageProps {
  params: Promise<{
    plan: string;
    billing_cycle: string;
  }>;
}

const IosSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CheckoutPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  const [isAnnual, setIsAnnual] = useState(resolvedParams.billing_cycle === "yearly");
  const [isBusiness, setIsBusiness] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [pendingUsername, setPendingUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPendingUsername(localStorage.getItem("pendingUsername") || "");
    }
    // Mock implementation - set mock plans
    const mockPlans: Plan[] = [
      {
        id: 'free',
        code: 'free',
        name: 'Free',
        description: 'Basic email service for personal use',
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: 'USD',
        storageQuota: 1073741824,
        mailboxLimit: 1,
        features: ['1 Email Address', '1GB Storage', 'Basic Support'],
        isPublic: true
      },
      {
        id: 'pro',
        code: 'pro',
        name: 'Pro',
        description: 'Professional email service for individuals',
        monthlyPrice: 999, // $9.99 in cents
        yearlyPrice: 9999, // $99.99 in cents
        currency: 'USD',
        storageQuota: 10737418240,
        mailboxLimit: 5,
        features: ['5 Email Addresses', '10GB Storage', 'Priority Support', 'Custom Domain'],
        isPublic: true
      },
      {
        id: 'business',
        code: 'business',
        name: 'Business',
        description: 'Advanced email service for teams',
        monthlyPrice: 2999, // $29.99 in cents
        yearlyPrice: 29999, // $299.99 in cents
        currency: 'USD',
        storageQuota: 107374182400,
        mailboxLimit: 25,
        features: ['25 Email Addresses', '100GB Storage', '24/7 Support', 'Custom Domain', 'Advanced Security'],
        isPublic: true
      }
    ];
    setPlans(mockPlans);
    setIsLoadingPlans(false);
  }, []);

  if (isLoadingPlans) {
    return (
      <div className="flex min-h-screen w-full bg-black items-center justify-center">
        <IosSpinner className="w-8 h-8 text-white" />
      </div>
    );
  }

  const planInfo = plans.find(p => p.id === resolvedParams.plan || p.code === resolvedParams.plan);

  if (!planInfo) {
    return (
      <div className="flex min-h-screen w-full bg-black items-center justify-center text-white">
        Plan not found. Please go back.
      </div>
    );
  }

  // Calculate prices based on selection (assuming backend returns in cents/paise)
  const monthlyPrice = planInfo.monthlyPrice / 100;
  const yearlyPrice = planInfo.yearlyPrice / 100;
  const currentPrice = isAnnual ? yearlyPrice : monthlyPrice;

  const displayCurrency = planInfo.currency === "USD" ? "$" : (planInfo.currency === "INR" ? "₹" : planInfo.currency);
  const displayPrice = `${displayCurrency}${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  
  const annualSavings = (monthlyPrice * 12) - yearlyPrice;

  const handleSubscribe = async () => {
    setIsButtonLoading(true);
    try {
      const username = localStorage.getItem("pendingUsername");
      const domain = localStorage.getItem("pendingDomain");
      const password = localStorage.getItem("pendingPassword");
      const planId = planInfo.id;
      const billingCycle = isAnnual ? "yearly" : "monthly";

      if (!username || !domain || !password) {
        throw new Error("Missing pending account details. Please go back and try again.");
      }

      // Mock implementation - simulate checkout session creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store checkout session ID for success page
      const mockSessionId = "mock-session-" + Date.now();
      localStorage.setItem("checkoutSessionId", mockSessionId);
      
      // Redirect to success page (in real implementation, this would redirect to payment provider)
      router.push(`/account/create/subscription/success?session_id=${mockSessionId}`);
      
    } catch (e: any) {
      alert(e.message || "An error occurred during payment initialization");
      setIsButtonLoading(false);
    }
  };

  return (
    <>
      {/* Full Page Spinner */}
      {isPageLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-500 overflow-hidden touch-none overscroll-none">
          <div className="bg-transparent p-5 rounded-[20px] shadow-2xl flex items-center justify-center border border-gray-100">
            <IosSpinner className="w-9 h-9 text-white" />
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full font-sans bg-black">

        {/* Left Column - Dark Theme */}
        <div className="w-full md:w-1/2 bg-[#000] text-white flex flex-col min-h-screen border-r border-gray-900 items-center md:items-end justify-start pt-6 md:pt-10">
          <div className="w-full max-w-[440px] px-8 md:px-12 lg:pr-16 lg:pl-0 pb-10">

            {/* Back and Logo */}
            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => router.push("/account/create")}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaArrowLeft size={14} />
              </button>
              <div className="w-12 h-12 flex items-center justify-center p-1.5">
                <img src="/logo/logo-01.png" alt="Logo" className="w-full h-full object-contain brightness-0 invert opacity-90" />
              </div>
            </div>

            {/* Subscribe Heading */}
            <p className="text-white text-sm mb-2 font-medium">Subscribe to {planInfo.name} Mail</p>
            <div className="flex items-end gap-2 mb-8">
              <h1 className="text-[42px] font-bold leading-none tracking-tight">{displayPrice}</h1>
              <div className="text-white font-medium text-sm leading-tight pb-1">
                per<br />{isAnnual ? 'year' : 'month'}
              </div>
            </div>

            <p className="text-[#fff]/60 font-medium text-xs mb-10 leading-relaxed max-w-sm">
              Charges can vary based on exchange rates according to {planInfo.currency}.
            </p>

            {/* Plan Card */}
            <div className="bg-[#000] border-2 border-[#fff]/5 rounded-xl overflow-hidden mb-8">
              <div className="p-5 border-b border-[#fff]/5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 p-1">
                      <img src="/logo/logo-01.png" alt="Logo" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <span className="font-semibold text-[15px]">{planInfo.name}</span>
                  </div>
                  <span className="font-semibold">{displayPrice}</span>
                </div>
                <p className="text-[#fff] font-medium text-[13px] leading-relaxed mb-3">
                  {planInfo.description}
                </p>
                <p className="text-[#fff] font-semibold px-3 py-2 w-fit bg-white/5 text-[13px]">
                  Billed {isAnnual ? 'yearly' : 'monthly'}
                </p>
              </div>

              <div className="p-4 flex items-start justify-between bg-[#0a0a0c]">
                <div className="flex flex-col gap-3">
                  {/* Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsAnnual(!isAnnual)}
                      className={`cursor-pointer w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${isAnnual ? 'bg-white' : 'bg-[#3a3a3c]'}`}
                    >
                      <div className={`w-[18px] h-[18px] bg-black rounded-full absolute top-[2px] transition-all ${isAnnual ? 'right-[2px]' : 'left-[2px] bg-white'}`}></div>
                    </button>
                    {annualSavings <= 0 && (
                      <span className="font-semibold text-[13px]">Annual billing</span>
                    )}
                  </div>

                  {/* Savings Block */}
                  {annualSavings > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 text-[#fff] px-2.5 py-1 rounded-[6px] font-medium text-[14px] leading-tight tracking-wide">
                        Save {displayCurrency}{annualSavings}
                      </div>
                      <div className="font-semibold text-[14px] leading-tight">
                        <div>with annual</div>
                        <div>billing</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Monthly Price Right Aligned */}
                {annualSavings > 0 && (
                  <div className="text-[14px] font-semibold text-gray-300 self-center">
                    {displayCurrency}{(yearlyPrice / 12).toFixed(2)}/month
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-4 text-[14px]">
              <div className="flex justify-between text-white font-semibold">
                <span>Subtotal</span>
                <span>{displayPrice}</span>
              </div>
              <div className="flex justify-between text-[#fff] font-semibold relative">
                <span className="flex items-center gap-1.5">
                  Tax
                  <div className="group relative flex items-center">
                    <button type="button" className="text-gray-400 hover:text-gray-200 transition-colors cursor-help rounded-full border border-gray-500 hover:border-gray-300 w-[18px] h-[18px] flex items-center justify-center text-[11px] font-serif italic">
                      i
                    </button>
                    {/* Tooltip Bubble */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-[240px] bg-white text-black font-medium text-[13px] p-3 rounded-md shadow-xl z-50 border border-gray-100 pointer-events-none">
                      <div className="absolute top-1/2 -left-[6px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white drop-shadow-[-1px_0_0_rgba(243,244,246,1)]"></div>
                      Tax is determined by billing information.
                    </div>
                  </div>
                </span>
                <span>Enter address to calculate</span>
              </div>
              <div className="flex justify-between font-semibold text-[18px] pt-4 border-t border-[#2c2c2e]">
                <span>Total due today</span>
                <span>{displayPrice}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Light Theme */}
        <div className="w-full md:w-1/2 bg-[#ffffff] text-black flex flex-col items-center md:items-start min-h-screen justify-start pt-6 md:pt-10 pb-10 md:pb-0">
          <div className="w-full max-w-[480px] px-8 md:px-12 lg:pl-16 lg:pr-0 pb-10">

            {/* Express Checkout */}
            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-black text-white rounded-[4px] h-11 flex items-center justify-center gap-1 hover:bg-black/90 cursor-pointer transition-colors">
                <FaApple size={20} /> <span className="font-semibold">Pay</span>
              </button>
              <button className="flex-1 bg-white cursor-pointer border-2 border-black/5 text-black rounded-[4px] h-11 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <FaGooglePay size={42} />
              </button>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-[12px] text-[#8e8e93] font-medium">OR</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Form */}
            <div className="space-y-6">

              {/* Contact Info */}
              <div>
                <h2 className="text-[17px] font-semibold mb-3">Billing Account</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shrink-0">
                    <span className="text-gray-600 font-bold text-[15px]">{pendingUsername?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-black truncate">{pendingUsername}</span>
                    <span className="text-[13px] text-black/50 font-medium">This is your billing account, where all subscriptions, invoices, and payment methods are managed. </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-[17px] font-semibold mb-3">Payment method</h2>

                <div className="border-2 border-black/5 rounded-[5px] overflow-hidden mb-4">
                  {/* Card Tab */}
                  <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-2">
                    <div className="w-5 h-4 border border-gray-400 rounded-sm bg-gray-50 flex items-center justify-center">
                      <div className="w-4 h-1 bg-gray-400 rounded-sm"></div>
                    </div>
                    <span className="text-[14px] font-semibold">Card</span>
                  </div>

                  <div className="p-4 bg-white space-y-5">
                    {/* Card Info */}
                    <div>
                      <label className="block text-[13px] text-[#555] font-semibold mb-1.5">Card information</label>
                      <div className="border border-gray-200 rounded-[5px] overflow-hidden">
                        <div className="relative border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="1234 1234 1234 1234"
                            className="w-full h-11 px-3 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                          />
                          <div className="absolute right-3 top-0 h-full flex items-center gap-1.5 opacity-90">
                            <FaCcVisa size={24} className="text-[#1434CB]" />
                            <FaCcMastercard size={24} className="text-[#EB001B]" />
                            <FaCcAmex size={24} className="text-[#27AEE3]" />
                            <FaCcDiscover size={24} className="text-[#E55C20]" />
                          </div>
                        </div>
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="MM / YY"
                            className="w-1/2 h-11 px-3 border-r border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                          />
                          <div className="relative w-1/2">
                            <input
                              type="text"
                              placeholder="CVC"
                              className="w-full h-11 px-3 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                            />
                            <div className="absolute right-3 top-0 h-full flex items-center">
                              <div className="w-7 h-5 border border-gray-200 rounded-[3px] flex justify-end items-center px-1 bg-gray-50/50">
                                <span className="text-[9px] font-bold text-gray-400">123</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-[13px] text-[#555] font-semibold mb-1.5">Cardholder name</label>
                      <input
                        type="text"
                        placeholder="Full name on card"
                        className="w-full h-11 border border-gray-200 rounded-[5px] px-3 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 transition-shadow"
                      />
                    </div>

                    {/* Billing Address */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[13px] text-[#555] font-semibold">Billing Information</label>
                      </div>
                      <div className="border border-gray-200 rounded-[5px] overflow-hidden bg-white">
                        <input
                          type="text"
                          placeholder="Billing Name (Individual or Company Name)"
                          className="w-full h-11 px-3 border-b border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                        <div className="relative border-b border-gray-200">
                          <select className="w-full h-11 px-3 text-[14px] focus:outline-none bg-transparent cursor-pointer appearance-none text-[#444] font-medium" defaultValue="Country / Region">
                            <option disabled>Country / Region</option>
                            <option>United States</option>
                            <option>India</option>
                            <option>United Kingdom</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Billing Address Line 1"
                          className="w-full h-11 px-3 border-b border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 2 (Optional)"
                          className="w-full h-11 px-3 border-b border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full h-11 px-3 border-b border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="State / Province / Region"
                            className="w-1/2 h-11 px-3 border-r border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Postal / ZIP Code"
                            className="w-1/2 h-11 px-3 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkboxes & Conditional Form */}
                <div className="space-y-4 mb-6 mt-4">
                  <label className="flex items-start gap-3 cursor-pointer" onClick={(e) => { e.preventDefault(); setIsBusiness(!isBusiness); }}>
                    <div className={`w-5 h-5 mt-0.5 border ${isBusiness ? 'border-black bg-black' : 'border-gray-300 bg-white'} rounded-[4px] flex items-center justify-center shrink-0 hover:border-gray-400 transition-colors`}>
                      {isBusiness && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[15px] text-[#444] font-medium">I'm purchasing as a business</span>
                  </label>

                  {isBusiness && (
                    <div className="pl-0 md:pl-8 space-y-2 mt-3 mb-5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[13px] text-[#555] font-semibold">Tax information</span>
                      </div>
                      <div className="border border-gray-200 rounded-[5px] overflow-hidden">
                        <input
                          type="text"
                          placeholder="Business name"
                          className="w-full h-11 px-3 border-b border-gray-200 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Tax ID"
                          className="w-full h-11 px-3 text-[14px] focus:outline-none focus:bg-blue-50/20 transition-colors placeholder-gray-400"
                        />
                      </div>
                    </div>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer" onClick={(e) => { e.preventDefault(); setSaveInfo(!saveInfo); }}>
                    <div className={`w-5 h-5 mt-0.5 border ${saveInfo ? 'border-black bg-black' : 'border-gray-300 bg-white'} rounded-[4px] flex items-center justify-center shrink-0 hover:border-gray-400 transition-colors`}>
                      {saveInfo && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[15px] text-[#444] font-medium">Save my information with <span className="font-bold text-black border-b border-dashed border-gray-400 pb-0.5">Norest Payments</span> for faster checkout</span>
                  </label>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={isButtonLoading}
                  className="w-full bg-black text-white flex items-center justify-center gap-2 rounded-[5px] h-12 font-semibold text-[15px] hover:bg-black/90 cursor-pointer transition-colors mb-6 disabled:opacity-80"
                >
                  {isButtonLoading ? <IosSpinner className="w-5 h-5 text-white" /> : null}
                  {isButtonLoading ? "Redirecting to secure checkout..." : "Subscribe"}
                </button>

                {/* Footer text */}
                <p className="text-[11px] text-gray-500 leading-relaxed text-center mb-6 max-w-sm mx-auto">
                  By subscribing, you authorise Norest Mail to charge you in {planInfo.currency} at the displayed exchange rate or the exchange rate at the time of billing, according to the terms until you cancel.
                </p>

                <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 font-medium">
                  <div className="flex items-center gap-1 hover:text-gray-600 cursor-pointer">
                    Powered by <span className="font-semibold text-[13px] text-[#000] flex items-center gap-0.5">Norest Payments</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <button className="hover:text-gray-600">Terms</button>
                  <span className="text-gray-300">|</span>
                  <button className="hover:text-gray-600">Privacy</button>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
