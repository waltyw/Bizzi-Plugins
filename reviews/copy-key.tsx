'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyKey({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };
  return (
    <div className="flex items-center gap-2 bg-black text-white rounded-xl p-3 font-mono text-sm">
      <span className="flex-1 truncate text-left">{value}</span>
      <button onClick={copy} className="p-2 rounded-lg hover:bg-white/10" aria-label="Copy licence key">
        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
