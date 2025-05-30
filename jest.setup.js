import '@testing-library/jest-dom';

// ✅ Mock de Gemini
jest.mock('./src/utils/gemini', () => ({
    getSummaryFromGemini: jest.fn(() => Promise.resolve("Résumé généré par mock")),
}));

// ✅ Patch TextEncoder / TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Patch global.fetch pour Jest (Node n’a pas fetch nativement)
if (!global.fetch) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([]), // Données mockées à personnaliser si besoin
        })
    );
}