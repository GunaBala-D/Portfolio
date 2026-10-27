import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';
import { Check, Copy } from './Icons';

/** Copies the email address and shows brief, screen-reader-announced feedback. */
export function CopyEmail({ className = 'btn' }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = profile.email;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      <button type="button" className={className} onClick={copy} aria-label={`Copy email address ${profile.email}`}>
        {copied ? <Check /> : <Copy />}
        {copied ? 'Copied' : 'Copy email'}
      </button>
      <div className={`toast ${copied ? 'is-shown' : ''}`} role="status" aria-live="polite">
        {copied && (
          <>
            <Check /> {profile.email} copied to clipboard
          </>
        )}
      </div>
    </>
  );
}
