import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import EntrySummary from "../components/EntrySummary";
import { apiRequest } from "../utils/api";

export default function EntryPanel({ onClose, onEntriesUpdated }) {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [showSummary, setShowSummary] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editData, setEditData] = useState({ title: "", content: "" });
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [summaryFetched, setSummaryFetched] = useState({});

useEffect(() => {
  const initialFetchMap = {};
  entries.forEach(entry => {
    if (entry.summary && entry.summary.trim().length > 0) {
      initialFetchMap[entry._id] = true;
    }
  });
  setSummaryFetched(initialFetchMap);
}, [entries]);


const handleSummaryClick = async (entry) => {
  const localSummary = entry.summary;

  // ✅ Ne génère rien si le résumé est déjà là
  if (localSummary && localSummary.trim().length > 0) {
    setSelectedEntry(entry);
    setShowSummary(true);
    return;
  }

  // ⛔ Sinon on génère une seule fois
  try {
    const res = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/journal/${entry._id}/generate-summary`, "POST");

    if (res.success && res.summary) {
      const updatedEntry = { ...entry, summary: res.summary };

      setEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? updatedEntry : e))
      );

      setSelectedEntry(updatedEntry);
      setShowSummary(true);

      if (typeof onEntriesUpdated === "function") {
        onEntriesUpdated(); // 🔁 Informe Dashboard que la base a changé
}

    }
  } catch (err) {
    console.error("Erreur lors de la génération du résumé :", err.message);
  }
};







  useEffect(() => {
  if (!showSummary) setSelectedEntry(null);
}, [showSummary]);


  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/journal`, "GET");
        console.log("📥 Données reçues du backend :", data);
        setEntries(data);
      } catch (err) {
        console.error("Erreur chargement entrées:", err.message);
      }
    };
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEntry = async () => {
    if (!formData.title || !formData.content) return;
    try {
      const newEntry = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/journal`, "POST", formData);
      setEntries((prev) => [newEntry, ...prev]);
      setFormData({ title: "", content: "" });
    } catch (err) {
      console.error("Erreur ajout:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/journal/${id}`, "DELETE");
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditData({ title: entry.title, content: entry.content });
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/journal/${editingEntry._id}`, "PUT", editData);
      // 🧹 Supprime le résumé localement si l'entrée a été modifiée
      updated.summary = "";
      setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      setEditingEntry(null);
    } catch (err) {
      console.error("Erreur modification:", err.message);
    }
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

        <h2 className="text-2xl font-semibold text-white mb-4">📓 Mes entrées</h2>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10"
          />
          <textarea
            name="content"
            placeholder="Contenu"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10 resize-none break-words custom-scrollbar max-h-40 overflow-y-auto"
          />
          <motion.button
            onClick={handleAddEntry}
            whileHover={{ scale: 1.1 }}
            className="mx-auto w-10 h-10 text-white text-2xl font-light flex items-center justify-center rounded-full bg-green-500/30 hover:bg-green-500/50 shadow-[0_0_12px_1px_rgba(34,197,94,0.3)] transition"
          >
            <span className="opacity-50" aria-label="ajouter">+</span>
          </motion.button>
        </div>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-gray-300 italic">Aucune entrée encore enregistrée...</p>
          ) : (
            <AnimatePresence initial={false}>
              {entries.map((entry) => {
                const isExpanded = expandedId === entry._id;
                const contentPreview = (entry?.content && typeof entry.content === "string")
                  ? entry.content.split(".")[0].trim() + "..."
                  : "...";

                return (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 p-4 rounded-lg border border-white/10 relative hover:shadow-md hover:scale-[1.01] transition-all duration-200"
                  >
                    <h3 className="text-white font-bold text-lg mb-1 break-words">{entry.title}</h3>

                    <div
                      className="overflow-hidden cursor-pointer transition-all duration-300"
                      onClick={() => toggleExpand(entry._id)}
                    >
                      <p className="text-gray-300 text-sm whitespace-pre-wrap break-words mb-2">
                        {isExpanded ? entry.content : contentPreview}
                      </p>
                    </div>

                    <p className="text-gray-400 text-xs mb-3">{entry.date}</p>

                    <motion.button
  onClick={() => handleSummaryClick(entry)}
  whileHover={{ scale: 1.05 }}
  className={`px-3 py-1 text-xs rounded-full border transition ${
    entry.summary && entry.summary.trim().length > 0
      ? "bg-green-500/20 hover:bg-green-500/30 text-green-200 border-green-400/30"
      : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border-pink-400/30"
  }`}
>
  {entry.summary && entry.summary.trim().length > 0
    ? "✅ Résumé déjà généré"
    : "🧠 Voir résumé IA"}
</motion.button>




                    <motion.button
                      onClick={() => handleDelete(entry._id)}
                      whileHover={{ scale: 1.15 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-red-500/40 hover:bg-red-500/60 shadow-[0_0_6px_1px_rgba(255,0,0,0.2)]"
                    />

                    <motion.button
                      onClick={() => handleEdit(entry)}
                      whileHover={{ scale: 1.1 }}
                      className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-blue-500/30 hover:bg-blue-500/50 shadow-[0_0_8px_1px_rgba(59,130,246,0.2)]"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {editingEntry && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute z-50 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl p-6 rounded-xl w-[90%] max-w-md"
        >
          <h3 className="text-white text-lg font-semibold mb-4">✏️ Modifier l’entrée</h3>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="w-full p-2 mb-3 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10"
          />
          <textarea
            name="content"
            value={editData.content}
            onChange={handleEditChange}
            rows="4"
            className="w-full p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10 custom-scrollbar max-h-40 overflow-y-auto"
          />
          <div className="flex justify-end mt-6 gap-4">
            <motion.button
              onClick={() => setEditingEntry(null)}
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full bg-red-500/30 hover:bg-red-500/50 shadow-[0_0_6px_1px_rgba(255,0,0,0.2)]"
              title="Annuler"
            />
            <motion.button
              onClick={handleSaveEdit}
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full bg-green-500/30 hover:bg-green-500/50 shadow-[0_0_6px_1px_rgba(34,197,94,0.3)]"
              title="Enregistrer"
            />
          </div>
        </motion.div>
      )}

      {showSummary && selectedEntry && (
  <EntrySummary
    content={selectedEntry.summary || "Résumé indisponible."}
    onClose={() => setShowSummary(false)}
  />
)}

    </motion.div>
  );
}
