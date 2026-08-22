import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Recipient {
  id: string;
  email: string;
  name?: string;
  raw: string;
}

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

function parseEmails(input: string): Recipient[] {
  // Split by comma, but try to avoid splitting inside quotes (simple approach)
  // For standard usage, simple split is usually okay unless they type "Last, First"
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);

  return parts.map(part => {
    // Check for "Name <email@domain.com>" or Name <email@domain.com>
    const match = part.match(/^(.*?)\s*<(.+)>$/);
    if (match) {
      const name = match[1].replace(/^["']|["']$/g, '').trim();
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: name || undefined,
        email: match[2].trim(),
        raw: part
      };
    }
    // Just an email
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: part,
      raw: part
    };
  });
}

function formatEmails(recipients: Recipient[]): string {
  return recipients.map(r => r.raw).join(', ');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RecipientInput({ value, onChange, placeholder, autoFocus }: RecipientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recipients = parseEmails(value);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const addRecipient = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError(null);
      return;
    }

    // Parse the new emails
    const newRecipients = parseEmails(trimmed);
    const validNewRecipients: Recipient[] = [];

    for (const newRecipient of newRecipients) {
      // Validate email format
      if (!isValidEmail(newRecipient.email)) {
        setError(`Invalid email format: ${newRecipient.email}`);
        return;
      }

      // Check for duplicates
      if (recipients.some(r => r.email.toLowerCase() === newRecipient.email.toLowerCase())) {
        setError(`Duplicate email: ${newRecipient.email}`);
        return;
      }

      validNewRecipients.push(newRecipient);
    }

    const combined = [...recipients, ...validNewRecipients];
    onChange(formatEmails(combined));
    setInputValue('');
    setError(null);
  };

  const removeRecipient = (id: string) => {
    const updated = recipients.filter(r => r.id !== id);
    onChange(formatEmails(updated));
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addRecipient(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && recipients.length > 0) {
      // Remove the last recipient when backspace is pressed and input is empty
      removeRecipient(recipients[recipients.length - 1].id);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (inputValue.trim()) {
      addRecipient(inputValue);
    }
  };

  return (
    <div
      className="relative flex-1 flex flex-wrap items-center gap-1.5 min-h-[30px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {recipients.map(recipient => {
        const displayLetter = (recipient.name || recipient.email).charAt(0).toUpperCase();
        const displayName = recipient.name || recipient.email;

        return (
          <div
            key={recipient.id}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full px-1.5 py-0.5 text-[12px] group relative select-none"
            title={recipient.email}
          >
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
              {displayLetter}
            </div>
            <span className="text-gray-700 dark:text-gray-200 truncate max-w-[150px]">
              {displayName}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeRecipient(recipient.id);
              }}
              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-white/20 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X size={10} />
            </button>
          </div>
        );
      })}

      <input
        ref={inputRef}
        type="text"
        className="flex-1 min-w-[120px] outline-none bg-transparent text-[13px] text-gray-800 dark:text-gray-200"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={recipients.length === 0 ? placeholder : ''}
      />
      {error && (
        <div className="absolute top-full left-0 mt-1 text-[11px] text-red-500 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow border border-red-200 z-10">
          {error}
        </div>
      )}
    </div>
  );
}
