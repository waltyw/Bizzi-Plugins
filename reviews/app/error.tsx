'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Admin page error', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-fade-soft px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <h1 className="font-display text-2xl font-extrabold mb-2">Admin error</h1>
        <p className="text-sm text-muted-foreground mb-3">
          The admin page hit a server error. In your hosting dashboard open <strong>Logs</strong> and search for the code below to see the exact cause.
        </p>
        {error.digest && <p className="text-xs font-mono bg-black/5 rounded-lg p-3 break-words mb-4">Error code: {error.digest}</p>}
        <button type="button" onClick={() => reset()} className="btn-brand w-full">Try again</button>
      </div>
    </main>
  );
}
