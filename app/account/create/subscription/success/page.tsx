"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const IosSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const [error, setError] = useState("");
  const hasProcessed = React.useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          throw new Error("Missing session ID. Cannot verify payment.");
        }

        // Mock implementation - simulate payment verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus("Provisioning your mailbox...");

        // Retrieve minimal state
        const username = localStorage.getItem("pendingUsername");
        const domain = localStorage.getItem("pendingDomain");
        const password = localStorage.getItem("pendingPassword");
        const planId = localStorage.getItem("pendingPlanId");
        const billingCycle = localStorage.getItem("pendingBillingCycle");

        if (!username || !domain || !password || !planId || !billingCycle) {
          throw new Error("Missing temporary registration state. Please contact support.");
        }

        // Mock account provisioning
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus("Account setup complete!");

        // Clear temporary state
        localStorage.removeItem("pendingUsername");
        localStorage.removeItem("pendingDomain");
        localStorage.removeItem("pendingPassword");
        localStorage.removeItem("pendingPlanId");
        localStorage.removeItem("pendingBillingCycle");

        localStorage.setItem("reservedUsername", username);
        localStorage.setItem("reservedDomain", domain);
        localStorage.setItem("registeredPassword", password);
        localStorage.setItem("accessToken", "mock-access-token");

        // Redirect
        router.push("/account/create/complete-profile");

      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred during account provisioning.");
        setStatus("Error occurred");
      }
    };

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen w-full bg-black text-white items-center justify-center font-sans">
      <div className="flex flex-col items-center max-w-md text-center p-6">
        {!error ? (
          <div key="loading-state">
            <div className="bg-white/10 p-5 rounded-[20px] mb-6 flex items-center justify-center">
              <IosSpinner className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-3">{status}</h1>
            <p className="text-gray-400 text-sm">Please do not close this window while we configure your workspace.</p>
          </div>
        ) : (
          <div key="error-state">
            <div className="bg-red-500/20 p-5 rounded-full mb-6 flex items-center justify-center border border-red-500/30">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-8">{error}</p>
            <button
              onClick={() => router.push("/account/create")}
              className="bg-white text-black font-semibold px-8 py-3 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to start
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><IosSpinner className="w-8 h-8 text-white" /></div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
