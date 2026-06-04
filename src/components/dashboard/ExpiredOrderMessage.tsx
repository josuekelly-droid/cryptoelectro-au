"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ExpiredOrderMessage() {
  const searchParams = useSearchParams();
  const showExpiredMessage = searchParams.get("expired") === "true";

  if (!showExpiredMessage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-error/10 border border-error/30 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏰</span>
        <div>
          <p className="text-error font-heading font-semibold">Commande annulée</p>
          <p className="text-sm text-text-primary/70">
            Le délai de paiement d&apos;une heure est dépassé. Votre commande a été automatiquement annulée.
          </p>
        </div>
      </div>
    </motion.div>
  );
}