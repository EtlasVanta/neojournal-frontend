import { motion } from "framer-motion";

export default function IASummaryPanel({ entries = [], onClose }) {
  // 🛡️ Protection si entries n'est pas un tableau (ex: message d'erreur JSON)
  if (!Array.isArray(entries)) {
    console.warn("❌ Entrées invalides reçues dans IASummaryPanel:", entries);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-white/5 backdrop-blur-[1px]"
      >
        <div className="bg-red-600/10 backdrop-blur-[1px] border border-red-500/20 shadow-xl rounded-2xl w-full max-w-xl p-8 relative text-white">
          <h2 className="text-xl font-semibold mb-4">Erreur</h2>
          <p className="text-sm text-red-300">
            Les données reçues ne sont pas valides. Assure-toi d’être connecté avec un token actif.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500/50 hover:bg-red-500/70 rounded-xl text-sm"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    );
  }

  const summarizedEntries = entries.filter(
    (entry) => entry.summary && entry.summary.length > 0
  );

  console.log("📦 Données reçues dans IASummaryPanel:", entries);


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

        <h2 className="text-2xl font-semibold text-white mb-4">🧠 Résumés IA</h2>

        {summarizedEntries.length === 0 ? (
          <div className="text-gray-300 italic">
            Aucun résumé IA disponible pour le moment.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summarizedEntries.map((entry) => (
              <div
                key={entry._id}
                className="p-4 rounded-xl bg-pink-500/10 border border-pink-300/20 text-white"
              >
                <h3 className="text-lg font-bold mb-1">{entry.title || "Sans titre"}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(entry.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-pink-200 whitespace-pre-wrap">
                  {entry.summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
