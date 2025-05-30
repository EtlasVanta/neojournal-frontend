// /src/utils/openai.js

export async function getSummaryFromOpenAI(content) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173", // obligatoire avec OpenRouter
            "X-Title": "NeoJournal",
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo", // Tu peux tester d'autres modèles gratuits
            messages: [{
                    role: "system",
                    content: "Tu es un assistant qui fait un résumé clair et synthétique de journaux personnels pour en tirer l'essentiel de manière calme, douce et respectueuse.",
                },
                {
                    role: "user",
                    content: `Voici mon journal : ${content}`,
                },
            ],
            temperature: 0.5,
        }),
    });

    const data = await response.json();

    if (
        data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content
    ) {
        return data.choices[0].message.content.trim();
    } else {
        console.error("🧠 OpenRouter API error:", data);
        throw new Error("Résumé impossible à générer.");
    }
}