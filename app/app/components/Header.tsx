"use client";

import { Search, Filter, Settings, Moon, Sun, ChevronDown, X, User, CreditCard, Plus, LogOut, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/lib/api/auth";
import { getAccessToken, clearTokens, logout } from "@/lib/token_manager";
import { triggerMailboxSync } from "../api/mockMailApi";

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  status: string;
}

export interface SubscriptionData {
  subscription: {
    id: string;
    status: string;
    plan: {
      id: string;
      name: string;
      displayName: string;
      description: string;
      features: string[];
    };
    billing: {
      interval: string;
      currency: string;
      price: number;
      trial: boolean;
      trialEndsAt: string | null;
    };
    startedAt: string;
    currentPeriod: {
      startsAt: string;
      endsAt: string;
    };
    renewal: {
      autoRenew: boolean;
      nextBillingDate: string;
      daysRemaining: number;
    };
    cancelation: {
      cancelAtPeriodEnd: boolean;
      cancelledAt: string | null;
    };
    limits: {
      mailboxes: number;
      storageBytes: number;
    };
    addons: any[];
    usage: {
      mailboxes: {
        used: number;
        limit: number;
      };
      storage: {
        usedBytes: number;
        limitBytes: number;
        used: string;
        limit: string;
        usedPercent: number;
      };
    };
  };
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [modalView, setModalView] = useState<'subscription' | 'billing'>('subscription');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Fetch user profile from API
    const fetchProfile = async () => {
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          setProfile({
            id: '',
            username: '',
            email: '',
            displayName: 'Guest',
            avatarUrl: null,
            createdAt: '',
            status: ''
          });
          return;
        }

        const response = await getUserProfile(accessToken);
        if (response) {
          // Extract name from email (first word before @)
          const emailName = response.email.split('@')[0];
          // Capitalize first letter for display name
          const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          
          setProfile({
            id: response.id,
            username: emailName,
            email: response.email,
            displayName: displayName,
            avatarUrl: null,
            createdAt: '',
            status: response.status
          });
        } else {
          console.log('API response unsuccessful, using default profile');
          setProfile({
            id: '',
            username: '',
            email: '',
            displayName: 'Guest',
            avatarUrl: null,
            createdAt: '',
            status: ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user profile from API, using default profile:', error);
        setProfile({
          id: '',
          username: '',
          email: '',
          displayName: 'Guest',
          avatarUrl: null,
          createdAt: '',
          status: ''
        });
      }
    };

    fetchProfile();
    
    // Mock subscription data for now
    setSubData({
      subscription: {
        id: 'mock-sub-1',
        status: 'active',
        plan: {
          id: 'free',
          name: 'Free',
          displayName: 'FREE',
          description: 'Basic email service',
          features: ['1 Email Address', '1GB Storage', 'Basic Support']
        },
        billing: {
          interval: 'monthly',
          currency: 'USD',
          price: 0,
          trial: false,
          trialEndsAt: null
        },
        startedAt: new Date().toISOString(),
        currentPeriod: {
          startsAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        renewal: {
          autoRenew: true,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          daysRemaining: 30
        },
        cancelation: {
          cancelAtPeriodEnd: false,
          cancelledAt: null
        },
        limits: {
          mailboxes: 1,
          storageBytes: 1073741824
        },
        addons: [],
        usage: {
          mailboxes: {
            used: 1,
            limit: 1
          },
          storage: {
            usedBytes: 0,
            limitBytes: 1073741824,
            used: '0 MB',
            limit: '1 GB',
            usedPercent: 0
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      // Call the logout function to clear tokens and invalidate session
      await logout();
      setShowProfileMenu(false);
      router.push('/account/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to sign-in even if logout fails
      clearTokens();
      setShowProfileMenu(false);
      router.push('/account/sign-in');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing...');
    
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setSyncStatus('No token available');
        return;
      }

      const result = await triggerMailboxSync();
      if (result.success) {
        setSyncStatus('Synced successfully');
        // Trigger a page reload to refresh messages
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSyncStatus('Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('Sync error');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus(null);
      }, 2000);
    }
  };

  return (
    <>
      <header className="h-[80px] border-b-2 border-border-divider flex items-center justify-between px-6 bg-bg-main shrink-0 z-20 relative transition-colors">
        {/* Search Bar */}
        <div id="tour-header" className="relative w-[340px] h-[42px] bg-black/5 dark:bg-black rounded-full flex items-center px-3 transition-colors">
          <Search size={16} className="text-text-tertiary shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full font-semibold placeholder:font-medium bg-transparent border-none outline-none text-[14px] text-text-primary placeholder:text-text-tertiary ml-2.5"
          />
          <Filter size={16} className="text-text-tertiary shrink-0 hover:text-text-primary cursor-pointer transition-colors ml-2" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Current Plan Badge */}
          <div
            id="tour-plan"
            onClick={() => { setShowSubscriptionModal(true); setModalView('subscription'); }}
            className="hidden sm:flex items-center mr-1 px-2.5 py-1 rounded-full border-2 border-border-divider text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span className="text-[11px] font-bold tracking-wider uppercase">
              {subData?.subscription?.plan?.displayName || "FREE"}
            </span>
          </div>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-[#1A1A1A] text-text-secondary hover:text-text-primary transition-all"
          >
            {mounted ? (
              theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
            ) : (
              <div className="w-[18px] h-[18px]" /> /* Placeholder during SSR to prevent mismatch */
            )}
          </button>

          {/* Settings */}
          <Link href="/app/settings" className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-[#1A1A1A] text-text-secondary hover:text-text-primary transition-all">
            <motion.div
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9, rotate: -90 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Settings size={18} />
            </motion.div>
          </Link>

          {/* Sync Button */}
          <div className="relative">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-[#1A1A1A] text-text-secondary hover:text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sync mailbox"
            >
              <motion.div
                animate={isSyncing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isSyncing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={18} />
              </motion.div>
            </button>
            
            {/* Sync Status Tooltip */}
            <AnimatePresence>
              {syncStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full right-0 mt-1 px-2 py-1 bg-black text-white text-[11px] rounded whitespace-nowrap"
                >
                  {syncStatus}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-border-divider mx-1" />

          {/* User Profile */}
          {profile && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex cursor-pointer items-center gap-2 px-1.5 py-1.5 pr-3.5 rounded-full bg-bg-panel border-2 border-border-divider hover:bg-bg-surface transition-all shadow-sm"
              >
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.displayName} className="w-7 h-7 rounded-full object-cover shadow-inner" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-[12px] font-bold shadow-inner">
                    {profile.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] font-semibold text-text-primary">{profile.displayName}</span>
                <ChevronDown
                  size={14}
                  className={`text-text-tertiary ml-1 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-full mt-2 w-[200px] bg-white dark:bg-[#1a1a1a] border border-black/8 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-[200]"
                  >
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                      <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{profile.displayName}</p>
                      {/* <p className="text-[11px] font-semibold text-gray-500 dark:text-white mt-0.5">@{profile.username}</p> */}
                      <p className="text-[11px] font-semibold text-gray-500 dark:text-white mt-0.5">{profile.email}</p>
                      {profile.createdAt && (
                        <p className="text-[10px] text-gray-400 dark:text-white mt-1">
                          Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <User size={15} className="text-gray-400 dark:text-gray-500" />
                        My Profile
                      </button>
                      <Link
                        href="/app/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors text-left cursor-pointer"
                      >
                        <Settings size={15} className="text-gray-400 dark:text-gray-500" />
                        Settings
                      </Link>
                    </div>

                    {/* Divider + Logout */}
                    <div className="border-t border-black/5 dark:border-white/5 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={15} />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Subscription Details Modal */}
      <AnimatePresence>
        {showSubscriptionModal && (
          <motion.div key="subscription-modal" className="fixed inset-0 z-[300] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowSubscriptionModal(false)}
            />

            {/* Modal Content container with mode="wait" to swap between views smoothly */}
            <AnimatePresence mode="wait">
              {modalView === 'billing' ? (
                <motion.div
                  key="billing-view"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-[640px] bg-white dark:bg-[#111] rounded-[32px] shadow-2xl p-2 font-sans flex flex-col"
                >
                  {/* Top Section */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {/* Left Image (Logo) */}
                    <div className="w-full sm:w-[260px] h-[260px] shrink-0 bg-[#000] rounded-[28px] flex items-center justify-center relative overflow-hidden">
                      <img src="/logo/logo-01.png" alt="Norest" className="w-24 h-auto object-contain brightness-0 invert opacity-90" />
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 px-4 sm:px-2 pt-4 pb-5 sm:py-6 sm:pr-6 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h2 className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">Norest {subData?.subscription.plan.displayName || "Pro"}</h2>

                        </div>
                        {/* Close Button */}
                        <button
                          onClick={() => setShowSubscriptionModal(false)}
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-gray-500 dark:text-gray-400 cursor-pointer -mt-2 -mr-2"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <p className="text-[15px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                        {subData?.subscription.plan.displayName || "Pro"} billing portal for managing your subscriptions, invoices & team limits.
                      </p>

                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex items-center gap-6 text-gray-700 dark:text-gray-300 font-semibold text-[15px]">
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Mailboxes</span>
                            <div className="flex items-center gap-1.5">
                              <User size={16} className="text-gray-400" />
                              <span>{subData?.subscription.usage.mailboxes.used || 0} / {subData?.subscription.usage.mailboxes.limit || 'Unlimited'}</span>
                            </div>
                          </div>
                          <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10"></div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Status</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-900 dark:text-white">Active</span>
                            </div>
                          </div>
                        </div>

                        <button className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white px-5 py-2.5 rounded-full font-bold text-[13px] transition-colors cursor-pointer">
                          Manage Plan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Payment Method */}
                  <div className="w-full bg-gray-50 dark:bg-black rounded-[24px] p-5 sm:p-6 mt-2">
                    <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wider">Payment Method</h3>

                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      {/* Left: Card Info */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-8 bg-[#1434CB] rounded-[4px] flex items-center justify-center text-white font-bold text-[13px] italic shadow-sm shrink-0">
                          VISA
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-gray-900 dark:text-white tracking-wide">•••• 4242</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-700 px-2 py-0.5 rounded-full">Default</span>
                          </div>
                          <span className="text-[13px] text-gray-500 font-medium mt-1">Expires 08/2029</span>
                        </div>
                      </div>

                      {/* Middle: Details */}
                      <div className="flex items-start gap-8 sm:gap-12 text-[13px]">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-500 font-medium">Used for</span>
                          <span className="font-bold text-gray-900 dark:text-white">Norest {subData?.subscription.plan.displayName || "Pro"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-500 font-medium">Last charged</span>
                          <span className="font-bold text-gray-900 dark:text-white">{subData?.subscription.startedAt ? new Date(subData.subscription.startedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "..."}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
                      <button className="text-[13px] font-bold text-gray-900 dark:text-white bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-white/20 transition-colors cursor-pointer">
                        Update Card
                      </button>
                      <button className="text-[13px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-full transition-colors cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="subscription-view"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-[400px] bg-white dark:bg-[#000] rounded-[24px] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden font-sans p-6 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-text-primary tracking-tight">Subscription Details</h2>
                    <button
                      onClick={() => setShowSubscriptionModal(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-text-secondary cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="text-[13px] text-text-secondary font-medium mb-6">
                    You are currently on the <strong className="text-text-primary">{subData?.subscription.plan.displayName || "..."}</strong> plan.
                  </p>

                  <div className="space-y-5">
                    {/* Storage */}
                    <div>
                      <div className="flex justify-between text-[12px] font-medium text-text-primary mb-2">
                        <span>Storage Used</span>
                        <span>{subData?.subscription.usage.storage.used} / {subData?.subscription.usage.storage.limit}</span>
                      </div>
                      <div className="w-full bg-border-divider h-1.5 rounded-full overflow-hidden">
                        <div className="bg-text-primary h-full rounded-full" style={{ width: `${subData?.subscription.usage.storage.usedPercent || 0}%` }}></div>
                      </div>
                    </div>

                    {/* Mailboxes */}
                    <div>
                      <div className="flex justify-between text-[12px] font-medium text-text-primary mb-2">
                        <span>Mailboxes Used</span>
                        <span>{subData?.subscription.usage.mailboxes.used || 0} / {subData?.subscription.usage.mailboxes.limit || 'Unlimited'}</span>
                      </div>
                      <div className="w-full bg-border-divider h-1.5 rounded-full overflow-hidden">
                        <div className="bg-text-primary h-full rounded-full" style={{ width: `${((subData?.subscription.usage.mailboxes.used || 0) / (subData?.subscription.usage.mailboxes.limit || 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-border-divider flex items-center justify-between">
                    <span className="text-[12px] text-text-secondary font-medium">Next billing: <strong className="text-text-primary">{subData?.subscription.renewal.nextBillingDate ? new Date(subData.subscription.renewal.nextBillingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "..."}</strong></span>
                    <button onClick={() => setModalView('billing')} className="text-[12px] font-bold text-text-primary hover:underline cursor-pointer">Manage Billing</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

