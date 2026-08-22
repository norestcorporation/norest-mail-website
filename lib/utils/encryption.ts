import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SHARE_SECRET || 'norest_share_secret_2026_x';

export const encryptId = (id: string): string => {
  if (!id) return '';
  const ciphertext = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
  // Make the base64 string URL-safe
  return ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decryptId = (encryptedId: string): string | null => {
  if (!encryptedId) return null;
  try {
    // Restore base64 characters
    let base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const bytes = CryptoJS.AES.decrypt(base64, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || null;
  } catch (error) {
    return null;
  }
};
