"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useMail } from "../context/MailContext";

export function DeliveryFailureNotification() {
  const { deliveryFailure, clearDeliveryFailure } = useMail();

  if (!deliveryFailure || !deliveryFailure.show) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] max-w-md w-full px-4"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg shadow-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-red-900 dark:text-white">
                {deliveryFailure.isPermanent ? 'Message not delivered' : 'Delivery temporarily unavailable'}
              </h3>
              <button
                onClick={clearDeliveryFailure}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-red-800 dark:text-red-200">
              Your message to <span className="font-medium">{deliveryFailure.recipientEmail}</span>
              {deliveryFailure.isPermanent ? ' could not be delivered.' : ' is experiencing delivery issues.'}
            </p>

            {deliveryFailure.errorMessage && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                {deliveryFailure.errorMessage}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}