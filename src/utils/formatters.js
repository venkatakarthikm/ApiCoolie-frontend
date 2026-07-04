/**
 * Helper to pretty-format JSON strings, falling back to raw text on error.
 * @param {string|object} value 
 * @param {string} [type='json'] 
 * @returns {string} Formatted output
 */
export function formatForDisplay(value, type = 'json') {
  if (value === null || value === undefined) return '';

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  const str = String(value).trim();
  if (type === 'json' || str.startsWith('{') || str.startsWith('[')) {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch (e) {
      return str;
    }
  }

  return str;
}

/**
 * Copies a string to the system clipboard using the modern Clipboard API.
 * @param {string} text 
 * @returns {Promise<boolean>} Success state
 */
export async function copyToClipboard(text) {
  if (!navigator.clipboard) {
    // Fallback
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (err) {
      console.error('Clipboard fallback copy failed:', err);
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}
