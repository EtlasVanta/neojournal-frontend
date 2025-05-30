import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [symbol, setSymbol] = useState("ε");
  const [isAnimating, setIsAnimating] = useState(false);
  const [bgImage, setBgImage] = useState("/assets/space-bg.jpg");
  const navigate = useNavigate();

  const handleEnter = () => {
    setSymbol("∞");
    setBgImage("/assets/space-dashboard.png"); // Nouveau fond
    setIsAnimating(true);
    setTimeout(() => navigate("/dashboard"), 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🔄 Background dynamique */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* 🌑 Overlay noir transparent */}
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      {/* 🌌 Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={
          isAnimating
            ? { scale: 3, opacity: 0, filter: "blur(10px)" }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-10 backdrop-blur-xl bg-white/10 px-10 py-12 rounded-2xl shadow-lg text-center max-w-md w-full border border-white/10"
      >
        <div className="text-white text-4xl font-bold mb-4 select-none transition-all duration-700">
          {symbol}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Bienvenue dans <br /> NeoJournal
        </h1>

        <p className="text-gray-300 mb-8">Plonge dans ton espace mental</p>

        <motion.button
          onClick={handleEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#7F5AF0] hover:bg-[#9E7DFB] text-white font-medium py-3 px-6 rounded-xl shadow-xl transition-all duration-300"
        >
          Entrer dans mon espace
        </motion.button>
      </motion.div>
    </div>
  );
}
