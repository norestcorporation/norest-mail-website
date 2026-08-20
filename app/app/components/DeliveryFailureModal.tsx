import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft, Clock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DeliveryFailureData {
  recipient_email: string;
  subject: string;
  failed_at: string;
  error_message: string;
  error_type?: string;
  is_permanent: boolean;
  status: string;
}

interface DeliveryFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryData: DeliveryFailureData;
  onRetry?: () => void;
  onBackToSent?: () => void;
}

export function DeliveryFailureModal({ 
  isOpen, 
  onClose, 
  deliveryData, 
  onRetry,
  onBackToSent 
}: DeliveryFailureModalProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const formatFailureTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const getFailureTitle = () => {
    if (deliveryData.status === 'temporary_failure') {
      return 'Delivery Temporarily Unavailable';
    }
    return 'Message Delivery Failed';
  };

  const getFailureDescription = () => {
    if (deliveryData.status === 'temporary_failure') {
      return `We couldn't deliver this message to ${deliveryData.recipient_email} right now. We'll retry automatically. You can check the message status for updates.`;
    }
    return `We couldn't deliver this message to ${deliveryData.recipient_email}.`;
  };

  const getRetryButtonText = () => {
    if (deliveryData.status === 'temporary_failure') {
      return 'Check Status';
    }
    return 'Retry';
  };

  const canRetry = () => {
    // Allow retry for temporary failures or if the error might be transient
    return deliveryData.status === 'temporary_failure' || 
           deliveryData.error_type === 'temporary_failure' ||
           deliveryData.error_type === 'mailbox_unavailable';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getFailureTitle()}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {getFailureDescription()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Recipient */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To</p>
                <p className="text-base text-gray-900 dark:text-white font-medium">
                  {deliveryData.recipient_email}
                </p>
              </div>
            </div>

            {/* Subject */}
            {deliveryData.subject && (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subject</p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {deliveryData.subject}
                  </p>
                </div>
              </div>
            )}

            {/* Failure Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {deliveryData.status === 'temporary_failure' ? 'Last Attempt' : 'Failed'}
                </p>
                <p className="text-base text-gray-900 dark:text-white">
                  {formatFailureTime(deliveryData.failed_at)}
                </p>
              </div>
            </div>

            {/* Error Details */}
            {deliveryData.error_message && (
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deliveryData.error_message}
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  deliveryData.is_permanent 
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' 
                    : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {deliveryData.is_permanent ? 'Permanent Failure' : 'Temporary Issue'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={onBackToSent || onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sent
            </button>

            {canRetry() && onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {getRetryButtonText()}
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
