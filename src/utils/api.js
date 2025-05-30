// src/utils/api.js

// Récupère l'URL du backend depuis le .env
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;

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

    const res = await fetch(`${BACKEND_URL}${path}`, {
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