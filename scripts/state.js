import { loadTransactions, saveTransactions, loadSettings, saveSettings } from './storage.js';

let transactions = [];
let settings = {};
let currentSection = 'dashboard';
let editingId = null;

export function init() {
  transactions = loadTransactions();
  settings = loadSettings();
}

export function getTransactions() {
  return [...transactions];
}

export function getSettings() {
  return { ...settings };
}

export function addTransaction(data) {
  const now = new Date().toISOString();
  const transaction = {
    id: `txn_${Date.now()}`,
    ...data,
    createdAt: now,
    updatedAt: now
  };
  transactions.push(transaction);
  saveTransactions(transactions);
  return transaction;
}

export function updateTransaction(id, data) {
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) return null;
  transactions[index] = {
    ...transactions[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveTransactions(transactions);
  return transactions[index];
}

export function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions(transactions);
}

export function setTransactions(data) {
  transactions = data;
  saveTransactions(transactions);
}

export function updateSettings(newSettings) {
  settings = { ...settings, ...newSettings };
  saveSettings(settings);
}

export function getCurrentSection() {
  return currentSection;
}

export function setCurrentSection(section) {
  currentSection = section;
}

export function getEditingId() {
  return editingId;
}

export function setEditingId(id) {
  editingId = id;
}
