// src/utils/api.js

// Récupère l'URL du backend depuis le .env
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;

console.log("🌍 BACKEND_URL =", BACKEND_URL); // 👈 ajoute cette ligne

// Fonction générique pour appeler ton API
export async function apiRequest(path, method = "GET", body = null, token = null) {
    const headers = { "Content-Type": "application/json" };

    // Ajoute le token s'il existe
    if (!token) {
        token = localStorage.getItem("token");
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${BACKEND_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : "/" + path}`;

    const res = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Erreur inconnue");
    }

    return data;
}

// Exemple d'utilisation exportée
export function getJournalEntries() {
    return apiRequest("/api/journal", "GET");
}