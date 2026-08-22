"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getMessageDetail, MessageDetail } from "@/lib/api/message_viewer";
import { decryptId } from "@/lib/utils/encryption";
import { EmailContentRenderer } from "../../../app/components/EmailContentRenderer";
import { Loader2, Mail, ShieldAlert, Copy, Check, Link as LinkIcon, Lock, Globe } from "lucide-react";
import QRCode from "react-qr-code";

function SharePageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [message, setMessage] = useState<MessageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [accessMode, setAccessMode] = useState<'public' | 'invite'>('public');
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setError("No message ID provided");
      setLoading(false);
      return;
    }

    const decryptedId = decryptId(id);
    if (!decryptedId) {
      setError("Invalid or malformed share link.");
      setLoading(false);
      return;
    }

    const fetchMessage = async () => {
      try {
        const msg = await getMessageDetail(decryptedId);
        setMessage(msg);
      } catch (err) {
        console.error("Failed to fetch message:", err);
        setError("Failed to load message. It may have been deleted or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000]">
        <div className="max-w-md w-full text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const htmlContent = message.html_body || message.text_body || "";

  return (
    <div className="min-h-screen bg-white dark:bg-[#000] text-gray-900 dark:text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto pb-12">
        <header className="mb-10">

          <a
            href="/app/inbox"
            className="inline-flex items-center gap-2 px-4 py-2 -ml-4 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-sm font-medium text-gray-500 dark:text-gray-400 mb-6"
          >
            <Mail size={16} />
            <span>Back to Inbox</span>
          </a>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            {message.subject || "No Subject"}
          </h1>

          {/* Horizontal Share Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8 p-1.5 bg-white dark:bg-[#1A1A1A] rounded-xl w-fit border border-gray-100 dark:border-white/5">

            {/* Tiny QR Code */}
            {shareUrl && (
              <div className="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100/50 shrink-0 cursor-crosshair group relative z-10 hover:z-50 transition-all duration-300 hover:scale-[4] origin-top-left hover:shadow-2xl">
                <QRCode value={shareUrl} size={42} level="M" />
              </div>
            )}

            <div className="h-10 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

            {/* Access Control */}
            <div className="flex bg-gray-200/50 dark:bg-black/40 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setAccessMode('public')}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${accessMode === 'public'
                  ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Globe size={14} className={accessMode === 'public' ? 'text-blue-500' : ''} />
                Anyone
              </button>
              <button
                onClick={() => setAccessMode('invite')}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${accessMode === 'invite'
                  ? 'bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Lock size={14} className={accessMode === 'invite' ? 'text-blue-500' : ''} />
                Invite
              </button>
            </div>

            <div className="h-10 w-px bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className={`h-9 px-4 mr-1 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all shrink-0 ${copied
                ? 'bg-green-500/10 text-green-600 dark:text-green-500'
                : 'bg-white dark:bg-[#2A2A2A] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 shadow-sm'
                }`}
            >
              {copied ? <Check size={14} /> : <LinkIcon size={14} />}
              {copied ? 'Copied Link' : 'Copy Link'}
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-medium text-gray-900 dark:text-white">{message.from?.[0]?.name || message.from?.[0]?.email}</span>
            <span className="text-gray-500 dark:text-gray-500">&lt;{message.from?.[0]?.email}&gt;</span>
            <span className="mx-2">•</span>
            <span>{new Date(message.received_at || message.sent_at).toLocaleString()}</span>
          </div>
          {message.to && message.to.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-500">
              To: {message.to.map((t: any) => t.email).join(', ')}
            </div>
          )}
        </header>

        {/* Email Content */}
        <main className="overflow-hidden">
          <div className="email-content-wrapper text-gray-900 dark:text-gray-200">
            <EmailContentRenderer html={htmlContent} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#000]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600" />
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
