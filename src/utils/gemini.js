export async function getSummaryFromGemini(content) {
    const apiKey =
        import.meta.env.VITE_GEMINI_API_KEY;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Voici mon journal personnel :\n\n${content}\n\nPeux-tu en faire un résumé synthétique, doux, apaisant et clair ?`,
                    }, ],
                }, ],
            }),
        }
    );

    const data = await response.json();
    console.log("🧠 Gemini API response:", data); // Pour debug

    try {
        return data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        console.error("❌ Erreur Gemini :", data);
        throw new Error("Résumé Gemini indisponible.");
    }
}