// Regex patterns
const PATTERNS = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i
};

export function validateDescription(value) {
  if (!value) return 'Description is required';
  if (!PATTERNS.description.test(value)) return 'No leading/trailing spaces allowed';
  if (PATTERNS.duplicateWord.test(value)) return 'Duplicate words detected';
  return '';
}

export function validateAmount(value) {
  if (!value) return 'Amount is required';
  if (!PATTERNS.amount.test(value)) return 'Invalid amount format (e.g., 12.50)';
  if (parseFloat(value) === 0) return 'Amount must be greater than 0';
  return '';
}

export function validateDate(value) {
  if (!value) return 'Date is required';
  if (!PATTERNS.date.test(value)) return 'Invalid date format (YYYY-MM-DD)';
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return 'Invalid date';
  }
  return '';
}

export function validateCategory(value) {
  if (!value) return 'Category is required';
  return '';
}

export function validateJSON(json) {
  if (!Array.isArray(json)) return 'Data must be an array';
  for (const item of json) {
    if (!item.id || !item.description || item.amount === undefined || !item.category || !item.date) {
      return 'Invalid transaction structure';
    }
  }
  return '';
}

export { PATTERNS };
