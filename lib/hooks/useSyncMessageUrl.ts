import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { encryptId, decryptId } from '@/lib/utils/encryption';

export function useSyncMessageUrl(
  selectedEmailId: string | null,
  setSelectedEmailId: (id: string | null) => void
) {
  const searchParams = useSearchParams();

  // On mount, check URL for 'id' and set selectedEmailId
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const decrypted = decryptId(idParam);
      if (decrypted) {
        setSelectedEmailId(decrypted);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When selectedEmailId changes, update URL without triggering a re-render
  useEffect(() => {
    // Check what's currently in the URL to avoid unnecessary updates
    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentId = currentUrlParams.get('id');

    if (selectedEmailId) {
      // Only encrypt and replace if the URL doesn't already contain the correct ID
      const decryptedCurrentId = currentId ? decryptId(currentId) : null;
      if (decryptedCurrentId !== selectedEmailId) {
        const newUrl = `${window.location.pathname}?id=${encryptId(selectedEmailId)}`;
        window.history.replaceState(null, '', newUrl);
      }
    } else if (currentId) {
      // Clear the ID if no email is selected
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedEmailId]);
}
