import { motion } from "framer-motion";

export default function DialoguesPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/5 backdrop-blur-[1px]"
    >
      <div className="bg-white/10 backdrop-blur-[1px] border border-white/20 shadow-xl rounded-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#a855f7]/30 hover:bg-[#a855f7]/50 border border-white/20 transition-shadow"
          aria-label="Fermer"
        />

        <h2 className="text-2xl font-semibold text-white mb-4">🧠 Dialogues Internes</h2>

        <p className="text-white/80 mb-4 text-sm">
          Ici tu peux explorer des discussions avec toi-même, laisser s’exprimer différentes facettes de ton mental, ou dialoguer avec ton toi du futur.
        </p>

        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-white font-semibold">👤 Moi : </h3>
            <p className="text-white/70">Je me sens dépassé par toutes ces pensées qui tournent.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-white font-semibold">🧠 Intuition : </h3>
            <p className="text-white/70">Et si tu prenais 5 minutes pour t’écouter sans juger ?</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
