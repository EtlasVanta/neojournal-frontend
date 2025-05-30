import React from 'react';
import { motion } from "framer-motion";

export default function EntrySummary({ onClose, content }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl w-full max-w-xl p-6 relative text-white">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-pink-500/30 hover:bg-pink-500/50 border border-white/20 transition-shadow"
          aria-label="Fermer"
        />
        <h2 className="text-xl font-semibold mb-4">🧠 Résumé IA</h2>

        {content ? (
          <p className="text-white/90 whitespace-pre-wrap break-words text-sm">
            {content}
          </p>
        ) : (
          <p className="text-gray-300 italic">Aucun résumé disponible.</p>
        )}
      </div>
    </motion.div>
  );
}

