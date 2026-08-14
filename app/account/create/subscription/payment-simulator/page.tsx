"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const IosSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PaymentSimulatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><IosSpinner className="w-8 h-8 text-white" /></div>}>
      <PaymentSimulatorContent />
    </Suspense>
  );
}

function PaymentSimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ENABLE_DEV_CHECKOUT !== "true") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
        This route is only available in development mode.
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
        Invalid checkout session.
      </div>
    );
  }

  const handleAction = async (action: 'complete' | 'fail' | 'cancel') => {
    setIsLoading(true);
    setError("");

    try {
      // Mock implementation - simulate payment action
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'complete') {
        router.push(`/account/create/subscription/success?session_id=${sessionId}`);
      } else if (action === 'fail') {
        router.push(`/account/create/subscription/success?session_id=${sessionId}`); // Success page will show "Payment has not been completed"
      } else {
        router.push(`/account/create`); // Cancel -> Back to pricing
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white items-center justify-center font-sans p-6">
      <div className="bg-[#111] border border-gray-800 rounded-xl w-full max-w-md p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Norest Checkout (Development)</h1>
        <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-gray-800">
          This is a simulated checkout page. No real transactions are processed.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            disabled={isLoading}
            onClick={() => handleAction('complete')}
            className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20 transition-colors cursor-pointer group"
          >
            <span className="font-semibold">✓ Simulate Successful Payment</span>
            {isLoading && <IosSpinner className="w-5 h-5 opacity-50" />}
          </button>

          <button 
            disabled={isLoading}
            onClick={() => handleAction('fail')}
            className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <span className="font-semibold">✗ Simulate Failed Payment</span>
          </button>

          <button 
            disabled={isLoading}
            onClick={() => handleAction('cancel')}
            className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-gray-500/10 border border-gray-500/30 text-gray-300 hover:bg-gray-500/20 transition-colors cursor-pointer"
          >
            <span className="font-semibold">↺ Cancel Payment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
