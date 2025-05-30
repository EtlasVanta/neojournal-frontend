export async function apiRequest(url, method = "GET", body = null) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Erreur inconnue");

    return data;
}

export function getJournalEntries() {
    return apiRequest("/api/journal");
}