import { highlight } from './search.js';

export function showSection(sectionId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('active');
    b.removeAttribute('aria-current');
  });
  
  document.getElementById(`section-${sectionId}`).classList.add('active');
  const btn = document.getElementById(`nav-${sectionId}`);
  btn.classList.add('active');
  btn.setAttribute('aria-current', 'page');
}

export function renderStats(transactions, settings) {
  const total = transactions.length;
  const sum = transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0);
  
  const categories = {};
  transactions.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
  });
  const topCategory = Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0] || '—';
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekSum = transactions
    .filter(t => new Date(t.date) >= weekAgo)
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-spent').textContent = formatCurrency(sum, settings.currency);
  document.getElementById('stat-category').textContent = topCategory;
  document.getElementById('stat-week').textContent = formatCurrency(weekSum, settings.currency);
  
  updateBudgetCap(sum, settings.budgetCap);
}

function updateBudgetCap(spent, cap) {
  const percent = Math.min((spent / cap) * 100, 100);
  const bar = document.getElementById('cap-bar');
  const msg = document.getElementById('cap-message');
  
  bar.style.width = `${percent}%`;
  bar.className = 'cap-bar';
  
  if (percent >= 100) {
    bar.classList.add('danger');
    msg.textContent = ` Budget exceeded by ${formatCurrency(spent - cap, 'USD')}`;
    msg.setAttribute('aria-live', 'assertive');
  } else if (percent >= 80) {
    bar.classList.add('warning');
    msg.textContent = `${formatCurrency(cap - spent, 'USD')} remaining (${(100 - percent).toFixed(0)}%)`;
    msg.setAttribute('aria-live', 'polite');
  } else {
    msg.textContent = `${formatCurrency(cap - spent, 'USD')} remaining (${(100 - percent).toFixed(0)}%)`;
    msg.setAttribute('aria-live', 'polite');
  }
}

export function renderTransactions(transactions, regex = null) {
  const container = document.getElementById('transactions-container');
  
  if (transactions.length === 0) {
    container.innerHTML = '<div class="empty-state">No transactions found</div>';
    return;
  }
  
  container.innerHTML = transactions.map(t => {
    const desc = regex ? highlight(t.description, regex) : t.description;
    const cat = regex ? highlight(t.category, regex) : t.category;
    
    return `
      <div class="transaction-card">
        <div class="transaction-header">
          <div class="transaction-desc">${desc}</div>
          <div class="transaction-amount">$${parseFloat(t.amount).toFixed(2)}</div>
        </div>
        <div class="transaction-meta">
          <span> ${cat}</span>
          <span> ${t.date}</span>
        </div>
        <div class="transaction-actions">
          <button class="btn-edit" data-id="${t.id}">Edit</button>
          <button class="btn-delete" data-id="${t.id}">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

export function sortTransactions(transactions, sortBy) {
  const sorted = [...transactions];
  
  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'amount-desc':
      return sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    case 'amount-asc':
      return sorted.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    case 'desc-asc':
      return sorted.sort((a, b) => a.description.localeCompare(b.description));
    case 'desc-desc':
      return sorted.sort((a, b) => b.description.localeCompare(a.description));
    default:
      return sorted;
  }
}

export function populateCategories(categories) {
  const select = document.getElementById('input-category');
  select.innerHTML = '<option value="">Select category</option>' +
    categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

export function renderCategoriesList(categories) {
  const list = document.getElementById('categories-list');
  list.innerHTML = categories.map(c => `
    <div class="category-tag">
      <span>${c}</span>
      <button class="category-remove" data-category="${c}" aria-label="Remove ${c}">×</button>
    </div>
  `).join('');
}

export function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

export function formatCurrency(amount, currency) {
  const symbols = { USD: '$', EUR: '€', GBP: '£' };
  return `${symbols[currency] || '$'}${amount.toFixed(2)}`;
}

export function setFormMode(mode, transaction = null) {
  const title = document.getElementById('form-title');
  const form = document.getElementById('transaction-form');
  const editId = document.getElementById('edit-id');
  
  if (mode === 'edit' && transaction) {
    title.textContent = 'Edit Transaction';
    editId.value = transaction.id;
    document.getElementById('input-description').value = transaction.description;
    document.getElementById('input-amount').value = transaction.amount;
    document.getElementById('input-category').value = transaction.category;
    document.getElementById('input-date').value = transaction.date;
  } else {
    title.textContent = 'Add Transaction';
    editId.value = '';
    form.reset();
  }
  
  clearErrors();
}

export function showError(field, message) {
  document.getElementById(`error-${field}`).textContent = message;
}

export function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}
