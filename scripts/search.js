export function compileRegex(input, caseSensitive = false) {
  if (!input) return null;
  try {
    return new RegExp(input, caseSensitive ? 'g' : 'gi');
  } catch {
    return null;
  }
}

export function highlight(text, regex) {
  if (!regex) return text;
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

export function searchTransactions(transactions, regex) {
  if (!regex) return transactions;
  return transactions.filter(t => 
    regex.test(t.description) || 
    regex.test(t.category) || 
    regex.test(String(t.amount))
  );
}
