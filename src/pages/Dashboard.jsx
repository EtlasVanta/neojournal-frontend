import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EntryPanel from "../components/EntryPanel";
import IASummaryPanel from "../components/IASummaryPanel";
import StatsPanel from "../components/StatsPanel";
import DreamPanel from "../components/DreamPanel";
import DialoguesPanel from "../components/DialoguesPanel";
import { apiRequest } from "../utils/api";

export default function Dashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [dreamOpen, setDreamOpen] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [entries, setEntries] = useState([]);

  // ✅ Fonction réutilisable pour charger les entrées
  const fetchEntries = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ Aucun token trouvé dans localStorage.");
      return;
    }

    try {
      const data = await apiRequest("/api/journal", "GET", null, token);
      console.log("✅ Données récupérées :", data);
      setEntries(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des entrées :", err);
    }
  };

  // 📦 Chargement initial
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleClick = (type) => {
    switch (type) {
      case "entries":
        setPanelOpen(true);
        break;
      case "summaries":
        fetchEntries(); // 🔁 Recharge à chaque ouverture du panneau Résumés IA
        setSummaryOpen(true);
        break;
      case "stats":
        setStatsOpen(true);
        break;
      case "dreams":
        setDreamOpen(true);
        break;
      case "dialogues":
        setDialogueOpen(true);
        break;
      case "logout":
        localStorage.removeItem("token");
        window.location.href = "/";
        break;
      default:
        break;
    }
  };

  const floating = (paused) => ({
    animate: paused
      ? {}
      : {
          y: [0, -12, 12, -6, 6, 0],
          x: [0, 6, -6, 3, -3, 0],
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        },
  });

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/assets/space-dashboard-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="absolute top-4 left-6 z-10">
        <h2 className="text-xl font-semibold text-white/50 tracking-wider select-none pointer-events-none">
          Dashboard
        </h2>
      </div>

      {/* Groupe 1 */}
      <div className="absolute bottom-8 left-8 z-20 space-y-6">
        {[
          { type: "entries", label: "📓 Mes entrées" },
          { type: "summaries", label: "🧠 IA Résumés" },
          { type: "stats", label: "📊 Statistiques" },
        ].map((item, index) => (
          <motion.div
            key={index}
            {...floating(hoveredIndex === index)}
            className="bg-[#00ffcc1a] hover:bg-[#00ffcc33] w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(item.type)}
            whileHover={{ scale: 1.15, boxShadow: "0 0 20px #00FFCC" }}
            whileTap={{ scale: 0.8, opacity: 0, filter: "blur(6px)" }}
          >
            {hoveredIndex === index && (
              <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-[#00ffcc22] text-white text-xs px-4 py-1 rounded-xl backdrop-blur-md whitespace-nowrap shadow-md border border-[#00ffcc55]">
                {item.label}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Groupe 2 */}
      <div className="absolute top-8 right-8 z-20 space-y-6">
        {[
          { type: "dreams", label: "🌙 Rêves" },
          { type: "dialogues", label: "🧠 Dialogues Internes" },
        ].map((item, index) => (
          <motion.div
            key={index}
            {...floating(hoveredIndex === index + 10)}
            className="bg-[#ff66cc1a] hover:bg-[#ff66cc33] w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition relative"
            onMouseEnter={() => setHoveredIndex(index + 10)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(item.type)}
            whileHover={{ scale: 1.15, boxShadow: "0 0 20px #ff66cc88" }}
            whileTap={{ scale: 0.8, opacity: 0, filter: "blur(6px)" }}
          >
            {hoveredIndex === index + 10 && (
              <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#ff66cc22] text-white text-xs px-4 py-1 rounded-xl backdrop-blur-md whitespace-nowrap shadow-md border border-[#ff66cc55]">
                {item.label}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Groupe 3 – Déconnexion */}
      <div className="absolute bottom-8 right-8 z-20">
        <motion.div
          {...floating(hoveredIndex === 99)}
          className="bg-[#ff00001a] hover:bg-[#ff000033] w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition relative"
          onMouseEnter={() => setHoveredIndex(99)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleClick("logout")}
          whileHover={{ scale: 1.15, boxShadow: "0 0 20px #ff000088" }}
          whileTap={{ scale: 0.8, opacity: 0, filter: "blur(6px)" }}
        >
          {hoveredIndex === 99 && (
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#ff000022] text-white text-xs px-4 py-1 rounded-xl backdrop-blur-md whitespace-nowrap shadow-md border border-[#ff000055]">
              🔒 Déconnexion
            </div>
          )}
        </motion.div>
      </div>

      {/* 🧩 Panels */}
      {panelOpen && (
        <EntryPanel
          onClose={() => setPanelOpen(false)}
          onEntriesUpdated={fetchEntries}
        />
      )}
      {summaryOpen && (
        <IASummaryPanel
          entries={entries}
          onClose={() => setSummaryOpen(false)}
        />
      )}
      {statsOpen && <StatsPanel onClose={() => setStatsOpen(false)} />}
      {dreamOpen && <DreamPanel onClose={() => setDreamOpen(false)} />}
      {dialogueOpen && <DialoguesPanel onClose={() => setDialogueOpen(false)} />}
    </div>
  );
}
