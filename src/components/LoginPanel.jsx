import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPanel({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur de connexion");

      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl w-full max-w-sm p-6 relative">
        <h2 className="text-xl text-white font-semibold mb-4">🔐 Connexion</h2>
        <input
          type="text"
          name="email"
          placeholder="Votre adresse e-mail"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-black/30 text-white placeholder-gray-400 border border-white/10"
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          className="w-full py-2 rounded bg-green-500/30 hover:bg-green-500/50 text-white font-medium transition"
        >
          Se connecter
        </motion.button>
      </div>
    </motion.div>
  );
}
