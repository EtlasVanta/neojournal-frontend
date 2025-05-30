/* eslint-env jest */

/// <reference types="jest" />
import EntryPanel from '../src/components/EntryPanel';

// 🧠 Mock Gemini
jest.mock('../src/utils/gemini', () => ({
  getSummaryFromGemini: jest.fn(() => Promise.resolve("Résumé généré par mock")),
}));


// 🧪 Mocks API
import {
  addEntry,
  deleteEntry,
  getSummary,
  apiRequest,
} from '../src/utils/api';

jest.mock('../src/utils/api', () => ({
  addEntry: jest.fn(),
  deleteEntry: jest.fn(),
  getSummary: jest.fn(),
  apiRequest: jest.fn()
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
//import EntryPanel from '../src/components/EntryPanel';

describe('🧪 EntryPanel Component', () => {
  const mockEntries = [
    { _id: '1', title: 'Titre 1', content: 'Contenu 1', summary: null },
    { _id: '2', title: 'Titre 2', content: 'Contenu 2', summary: null },
  ];

  beforeEach(() => {
    apiRequest.mockImplementation((url, method, body) => {
      if (method === 'GET') return Promise.resolve(mockEntries);
      if (method === 'POST') {
        return Promise.resolve({ _id: '3', title: 'Titre 3', content: 'Contenu 3' });
      }
      if (method === 'PUT') {
        return Promise.resolve({ _id: '1', title: 'Titre 1 modifié', content: 'Contenu 1 modifié' });
      }
      if (method === 'DELETE') return Promise.resolve({});
    });
    addEntry.mockResolvedValue({ _id: '3', title: 'Titre 3', content: 'Contenu 3' });
    deleteEntry.mockResolvedValue({});
    getSummary.mockResolvedValue({ summary: 'Résumé généré' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('📋 Affiche les entrées au chargement', async () => {
    render(<EntryPanel />);
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalled();
      expect(screen.getByText('Titre 1')).toBeInTheDocument();
      expect(screen.getByText('Titre 2')).toBeInTheDocument();
    });
  });

  test('📝 Ajoute une nouvelle entrée', async () => {
    render(<EntryPanel />);

    fireEvent.change(screen.getByPlaceholderText(/titre/i), {
      target: { value: 'Titre 3' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contenu/i), {
      target: { value: 'Contenu 3' },
    });

    const boutonAjout = screen.getByText('+').closest('button');
    fireEvent.click(boutonAjout);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/journal",
        "POST",
        { title: "Titre 3", content: "Contenu 3" }
      );
      expect(screen.getByText('Titre 3')).toBeInTheDocument();
    });
  });

  test('🧠 Génère un résumé IA pour une entrée', async () => {
    render(<EntryPanel />);
    await waitFor(() => screen.getByText('Titre 1'));

    const boutonRésumé = screen.getAllByText(/voir résumé ia/i)[0];
    fireEvent.click(boutonRésumé);

    await waitFor(() => {
      expect(screen.getByText('Résumé généré par mock')).toBeInTheDocument();
    });

    // expect(getSummary).toHaveBeenCalled();
  });

  test('🗑️ Supprime une entrée', async () => {
    render(<EntryPanel />);
    await waitFor(() => screen.getByText('Titre 1'));

    const bouton = screen.getAllByRole('button').find(btn =>
      btn.className.includes('bg-red-500') && btn.className.includes('rounded-full')
    );

    fireEvent.click(bouton);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/journal/1",
        "DELETE"
      );
    });
  });

  test('✏️ Modifie une entrée existante', async () => {
    render(<EntryPanel />);
    await waitFor(() => screen.getByText('Titre 1'));

    const boutonEdit = screen.getAllByRole('button').find(btn =>
      btn.className.includes('bg-blue-500')
    );
    fireEvent.click(boutonEdit);

    const inputTitre = screen.getByDisplayValue('Titre 1');
    const inputContenu = screen.getByDisplayValue('Contenu 1');

    fireEvent.change(inputTitre, { target: { value: 'Titre 1 modifié' } });
    fireEvent.change(inputContenu, { target: { value: 'Contenu 1 modifié' } });

    const boutonSave = screen.getAllByRole('button').find(btn =>
      btn.className.includes('bg-green-500') && btn.title === 'Enregistrer'
    );

    fireEvent.click(boutonSave);

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        "http://localhost:5000/api/journal/1",
        "PUT",
        {
          title: 'Titre 1 modifié',
          content: 'Contenu 1 modifié'
        }
      );
      expect(screen.getByText('Titre 1 modifié')).toBeInTheDocument();
    });
  });
test('🚫 Ne permet pas d’ajouter une entrée vide', async () => {
  render(<EntryPanel />);
  
  const boutonAjout = screen.getByText('+').closest('button');
  fireEvent.click(boutonAjout);

  await waitFor(() => {
    expect(apiRequest).not.toHaveBeenCalledWith(
      expect.stringContaining("/api/journal"),
      "POST",
      expect.objectContaining({ title: "", content: "" })
    );
  });
});

test('📭 Affiche un message si aucune entrée n’existe', async () => {
  apiRequest.mockResolvedValueOnce([]); // mock retour vide

  render(<EntryPanel />);
  
  await waitFor(() => {
    expect(screen.getByText(/aucune entrée encore enregistrée/i)).toBeInTheDocument();
  });
});

test('🔽 Alterne entre aperçu et contenu complet', async () => {
  render(<EntryPanel />);
  await waitFor(() => screen.getByText('Titre 1'));

  const preview = screen.getByText(/Contenu 1\.\.\./i);
  fireEvent.click(preview);

  await waitFor(() => {
    expect(screen.getByText('Contenu 1')).toBeInTheDocument();
  });
});


});
