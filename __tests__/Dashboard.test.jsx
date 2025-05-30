// __tests__/Dashboard.test.jsx
/* eslint-env jest */

// 🛠 Patch pour TextEncoder / TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../src/pages/Dashboard';

describe('📊 Dashboard Component', () => {
  beforeEach(() => {
    // Nettoyage du localStorage pour chaque test
    localStorage.clear();
    delete window.location;
    window.location = { href: '' }; // mock de redirection
  });

  test('📌 Affiche le titre Dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('📓 Ouvre le panneau "Mes entrées"', () => {
    render(<Dashboard />);

    // Sélectionne les "faux boutons" en se basant sur des classes stables
    const boutons = Array.from(document.querySelectorAll('.rounded-full.cursor-pointer'));
    expect(boutons.length).toBeGreaterThan(0);

    // Clique sur le premier bouton (Mes entrées)
    fireEvent.click(boutons[0]);

    expect(screen.getByText(/mes entrées/i)).toBeInTheDocument();
  });

  test('🔒 Clique sur Déconnexion supprime le token et redirige', () => {
    localStorage.setItem('token', 'fake-token');
    render(<Dashboard />);

    // Trouve tous les boutons arrondis cliquables
    const boutons = Array.from(document.querySelectorAll('.rounded-full.cursor-pointer'));
    
    // On considère que le bouton logout est le dernier (bottom-right)
    const boutonLogout = boutons[boutons.length - 1];
    expect(boutonLogout).toBeTruthy();

    fireEvent.click(boutonLogout);

    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toBe('/');
  });
});
