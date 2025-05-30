import { motion } from "framer-motion";

export default function StatsPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-white/5 backdrop-blur-[1px]"
    >
      <div className="bg-white/10 backdrop-blur-[1px] border border-white/20 shadow-xl rounded-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#a855f7]/30 hover:bg-[#a855f7]/50 border border-white/20 transition-shadow"
          aria-label="Fermer"
        />

        <h2 className="text-2xl font-semibold text-white mb-6">📊 Statistiques personnelles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
          <div className="bg-white/10 p-4 rounded-lg border border-white/10 shadow">
            <h3 className="text-lg font-bold">Entrées totales</h3>
            <p className="mt-2 text-2xl font-mono">42</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg border border-white/10 shadow">
            <h3 className="text-lg font-bold">Mots écrits</h3>
            <p className="mt-2 text-2xl font-mono">12 850</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg border border-white/10 shadow">
            <h3 className="text-lg font-bold">Fréquence</h3>
            <p className="mt-2 text-2xl font-mono">4.2 jours/sem</p>
          </div>

          <div className="bg-white/10 p-4 rounded-lg border border-white/10 shadow">
            <h3 className="text-lg font-bold">Dernière entrée</h3>
            <p className="mt-2 text-2xl font-mono">27/05/2025</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
