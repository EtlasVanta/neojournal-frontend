// /src/services/journalService.js
import { request } from './api';
import { apiRequest } from "../utils/api";

const data = await apiRequest("/api/journal");

export const getJournalEntries = (token) =>
    request('/api/journal', 'GET', null, token);

export const createJournalEntry = (data, token) =>
    request('/api/journal', 'POST', data, token);

export const updateJournalEntry = (id, data, token) =>
    request(`/api/journal/${id}`, 'PUT', data, token);

export const deleteJournalEntry = (id, token) =>
    request(`/api/journal/${id}`, 'DELETE', null, token);