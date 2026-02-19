const STORAGE_KEY = 'finance:transactions';
const SETTINGS_KEY = 'finance:settings';

export function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTransactions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSettings() {
  const defaults = {
    currency: 'USD',
    rates: { EUR: 1.09, GBP: 1.27 },
    budgetCap: 500,
    categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other']
  };
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
