import * as State from './state.js';
import * as UI from './ui.js';
import * as Validators from './validators.js';
import * as Search from './search.js';
import { clearAll } from './storage.js';

let currentRegex = null;
let currentSort = 'date-desc';

// Initialize
State.init();
const settings = State.getSettings();
UI.populateCategories(settings.categories);
UI.showSection('dashboard');
updateUI();

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const section = e.target.id.replace('nav-', '');
    State.setCurrentSection(section);
    UI.showSection(section);
    if (section === 'add') {
      UI.setFormMode('add');
    }
  });
});

// Form submission
document.getElementById('transaction-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const description = document.getElementById('input-description').value.trim();
  const amount = document.getElementById('input-amount').value.trim();
  const category = document.getElementById('input-category').value;
  const date = document.getElementById('input-date').value.trim();
  
  UI.clearErrors();
  
  const errors = {
    description: Validators.validateDescription(description),
    amount: Validators.validateAmount(amount),
    category: Validators.validateCategory(category),
    date: Validators.validateDate(date)
  };
  
  let hasError = false;
  for (const [field, error] of Object.entries(errors)) {
    if (error) {
      UI.showError(field, error);
      hasError = true;
    }
  }
  
  if (hasError) return;
  
  const data = { description, amount: parseFloat(amount), category, date };
  const editId = document.getElementById('edit-id').value;
  
  if (editId) {
    State.updateTransaction(editId, data);
    UI.showToast('Transaction updated');
  } else {
    State.addTransaction(data);
    UI.showToast('Transaction added');
  }
  
  updateUI();
  State.setCurrentSection('transactions');
  UI.showSection('transactions');
});

// Cancel button
document.getElementById('btn-cancel').addEventListener('click', () => {
  State.setCurrentSection('transactions');
  UI.showSection('transactions');
});

// Search
document.getElementById('search-input').addEventListener('input', handleSearch);
document.getElementById('search-case').addEventListener('change', handleSearch);

function handleSearch() {
  const input = document.getElementById('search-input').value;
  const caseSensitive = document.getElementById('search-case').checked;
  currentRegex = Search.compileRegex(input, caseSensitive);
  updateTransactionsList();
}

// Sort
document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  updateTransactionsList();
});

// Transaction actions (edit/delete)
document.getElementById('transactions-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-edit')) {
    const id = e.target.dataset.id;
    const transaction = State.getTransactions().find(t => t.id === id);
    if (transaction) {
      State.setEditingId(id);
      UI.setFormMode('edit', transaction);
      State.setCurrentSection('add');
      UI.showSection('add');
    }
  }
  
  if (e.target.classList.contains('btn-delete')) {
    if (confirm('Delete this transaction?')) {
      const id = e.target.dataset.id;
      State.deleteTransaction(id);
      UI.showToast('Transaction deleted');
      updateUI();
    }
  }
});

// Settings - Currency
document.getElementById('currency-select').addEventListener('change', (e) => {
  State.updateSettings({ currency: e.target.value });
  updateUI();
});

// Settings - Exchange rates
document.getElementById('rate-eur').addEventListener('change', (e) => {
  const settings = State.getSettings();
  settings.rates.EUR = parseFloat(e.target.value);
  State.updateSettings({ rates: settings.rates });
});

document.getElementById('rate-gbp').addEventListener('change', (e) => {
  const settings = State.getSettings();
  settings.rates.GBP = parseFloat(e.target.value);
  State.updateSettings({ rates: settings.rates });
});

// Settings - Budget cap
document.getElementById('budget-cap').addEventListener('change', (e) => {
  State.updateSettings({ budgetCap: parseFloat(e.target.value) });
  updateUI();
});

// Settings - Add category
document.getElementById('btn-add-category').addEventListener('click', () => {
  const input = document.getElementById('new-category');
  const value = input.value.trim();
  
  if (!value) return;
  
  const error = Validators.validateCategory(value);
  if (error) {
    UI.showToast(error);
    return;
  }
  
  const settings = State.getSettings();
  if (settings.categories.includes(value)) {
    UI.showToast('Category already exists');
    return;
  }
  
  settings.categories.push(value);
  State.updateSettings({ categories: settings.categories });
  input.value = '';
  updateUI();
  UI.showToast('Category added');
});

// Settings - Remove category
document.getElementById('categories-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('category-remove')) {
    const category = e.target.dataset.category;
    const settings = State.getSettings();
    settings.categories = settings.categories.filter(c => c !== category);
    State.updateSettings({ categories: settings.categories });
    updateUI();
    UI.showToast('Category removed');
  }
});

// Settings - Export
document.getElementById('btn-export').addEventListener('click', () => {
  const data = State.getTransactions();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  UI.showToast('Data exported');
});

// Settings - Import
document.getElementById('file-import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      const error = Validators.validateJSON(data);
      if (error) {
        UI.showToast(error);
        return;
      }
      State.setTransactions(data);
      updateUI();
      UI.showToast('Data imported successfully');
    } catch {
      UI.showToast('Invalid JSON file');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// Settings - Clear all
document.getElementById('btn-clear').addEventListener('click', () => {
  if (confirm('Clear all data? This cannot be undone.')) {
    clearAll();
    location.reload();
  }
});

// Update UI
function updateUI() {
  const transactions = State.getTransactions();
  const settings = State.getSettings();
  
  UI.renderStats(transactions, settings);
  updateTransactionsList();
  UI.populateCategories(settings.categories);
  UI.renderCategoriesList(settings.categories);
  
  document.getElementById('currency-select').value = settings.currency;
  document.getElementById('rate-eur').value = settings.rates.EUR;
  document.getElementById('rate-gbp').value = settings.rates.GBP;
  document.getElementById('budget-cap').value = settings.budgetCap;
}

function updateTransactionsList() {
  let transactions = State.getTransactions();
  transactions = Search.searchTransactions(transactions, currentRegex);
  transactions = UI.sortTransactions(transactions, currentSort);
  UI.renderTransactions(transactions, currentRegex);
}
