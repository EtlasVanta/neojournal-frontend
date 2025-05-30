import { motion } from "framer-motion";
import { useState } from "react";

export default function DreamPanel({ onClose }) {
  const [dreams, setDreams] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDream = () => {
    if (!formData.title || !formData.description) return;
    const newDream = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleDateString("fr-FR")
    };
    setDreams((prev) => [newDream, ...prev]);
    setFormData({ title: "", description: "" });
  };

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

        <h2 className="text-2xl font-semibold text-white mb-6">🌙 Rêves</h2>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Titre du rêve"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10"
          />
          <textarea
            name="description"
            placeholder="Décris ton rêve..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10 resize-none custom-scrollbar max-h-40 overflow-y-auto"
          />
          <motion.button
            onClick={handleAddDream}
            whileHover={{ scale: 1.1 }}
            className="mx-auto w-10 h-10 text-white text-2xl font-light flex items-center justify-center rounded-full bg-blue-500/30 hover:bg-blue-500/50 shadow-[0_0_12px_1px_rgba(59,130,246,0.3)] transition"
          >
            <span className="opacity-50">+</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {dreams.length === 0 ? (
            <p className="text-gray-300 italic">Aucun rêve enregistré pour le moment...</p>
          ) : (
            dreams.map((dream) => (
              <div key={dream.id} className="bg-white/10 p-4 rounded-lg border border-white/10">
                <h3 className="text-white font-bold text-lg mb-1 break-words">{dream.title}</h3>
                <p className="text-gray-300 text-sm whitespace-pre-wrap break-words mb-2">{dream.description}</p>
                <p className="text-gray-400 text-xs">{dream.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
