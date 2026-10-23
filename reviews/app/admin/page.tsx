import type { Metadata } from 'next';
import { KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { adminConfigured, isAdmin } from '@/lib/admin-auth';
import { CopyKey } from '@/components/copy-key';
import { issueLicence, login, logout, setLicenceStatus } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin · Bizzi Reviews', robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  wrong: 'Incorrect password.',
  locked: 'Too many attempts. Try again in 15 minutes.',
  invalid: 'That request was not valid.',
  server: 'Sign in failed on the server. Check the function logs in your hosting dashboard.',
};

const field = 'w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

function fmtDate(d: Date | null) {
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/London' }) : 'Never';
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; issued?: string }> }) {
  const { error, issued } = await searchParams;
  const errorText = error ? ERRORS[error] : null;

  if (!adminConfigured()) {
    return (
      <Shell>
        <h1 className="font-display text-2xl font-extrabold mb-2">Admin not set up</h1>
        <p className="text-muted-foreground text-sm">
          Add an <code className="font-mono">ADMIN_PASSWORD</code> environment variable (at least 8 characters) and redeploy to enable this page.
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
        <h1 className="font-display text-2xl font-extrabold mb-6">Admin sign in</h1>
        <form action={login} className="space-y-4">
          <input type="password" name="password" required autoComplete="current-password" placeholder="Admin password" className={field} />
          {errorText && <p className="text-sm text-red-600">{errorText}</p>}
          <button type="submit" className="btn-brand w-full">Sign in</button>
        </form>
      </Shell>
    );
  }

  let licences;
  try {
    licences = await prisma.license.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { _count: { select: { activations: true } } },
    });
  } catch (err) {
    const e = err as { code?: string; message?: string };
    console.error('Admin: could not load licences', e?.code, e?.message);
    const detail = String(e?.message ?? '').split('\n').filter(Boolean).pop()?.slice(0, 300) ?? '';
    return (
      <Shell>
        <h1 className="font-display text-2xl font-extrabold mb-2">Database problem</h1>
        <p className="text-sm text-muted-foreground mb-3">
          You are signed in, but the licence list could not be loaded from the database. Check that <code className="font-mono">DATABASE_URL</code> and <code className="font-mono">DIRECT_URL</code> are set in your hosting environment, and run <code className="font-mono">supabase-repair.sql</code> in the Supabase SQL editor to add any missing tables or columns.
        </p>
        <p className="text-xs font-mono bg-black/5 rounded-lg p-3 break-words mb-4">{e?.code ? `${e.code}: ` : ''}{detail || 'Unknown error'}</p>
        <form action={logout}><button type="submit" className="btn-brand w-full">Sign out</button></form>
      </Shell>
    );
  }

  return (
    <main className="min-h-screen bg-brand-fade-soft">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-extrabold">
            Licence <span className="text-primary">admin</span>
          </h1>
          <form action={logout}>
            <button type="submit" className="btn-brand-outline !px-5 !py-2"><LogOut className="w-4 h-4" /> Sign out</button>
          </form>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          <section className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2"><KeyRound className="w-5 h-5 text-primary" /> Issue a free licence</h2>
            <p className="text-xs text-muted-foreground mb-6">Works exactly like a paid key. No payment is taken.</p>
            {issued && (
              <div className="mb-6 rounded-2xl bg-primary/10 p-4">
                <p className="text-sm font-semibold mb-2">Licence created. Send this key and download link:</p>
                <CopyKey value={issued} />
                <a href={`/api/plugin/download?license=${encodeURIComponent(issued)}`} download="bizzi-reviews-pro.zip" className="btn-brand mt-3 w-full">
                  Download Pro zip for this key
                </a>
              </div>
            )}
            {errorText && <p className="text-sm text-red-600 mb-4">{errorText}</p>}
            <form action={issueLicence} className="space-y-4">
              <label className="block text-sm font-medium">Plan
                <select name="plan" defaultValue="pro" className={`${field} mt-1`}>
                  <option value="pro">Pro (1 site)</option>
                  <option value="agency">Agency (unlimited sites)</option>
                </select>
              </label>
              <label className="block text-sm font-medium">Valid for
                <select name="duration" defaultValue="1y" className={`${field} mt-1`}>
                  <option value="1m">1 month</option>
                  <option value="3m">3 months</option>
                  <option value="1y">1 year</option>
                  <option value="2y">2 years</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </label>
              <label className="block text-sm font-medium">Recipient email <span className="text-muted-foreground font-normal">(optional)</span>
                <input type="email" name="email" maxLength={200} className={`${field} mt-1`} placeholder="name@example.com" />
              </label>
              <label className="block text-sm font-medium">Note <span className="text-muted-foreground font-normal">(optional)</span>
                <input type="text" name="note" maxLength={120} className={`${field} mt-1`} placeholder="e.g. Reviewer, beta tester" />
              </label>
              <button type="submit" className="btn-brand w-full">Create licence</button>
            </form>
          </section>

          <section className="bg-white rounded-3xl shadow-xl p-6 overflow-x-auto">
            <h2 className="font-display text-xl font-bold mb-4">Licences <span className="text-muted-foreground text-sm font-normal">(latest {licences.length})</span></h2>
            {licences.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No licences yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">Key</th><th className="py-2 pr-3">Plan</th><th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Email / note</th><th className="py-2 pr-3">Sites</th><th className="py-2 pr-3">Expires</th>
                    <th className="py-2 pr-3">Status</th><th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {licences.map((l) => {
                    const free = l.stripeSessionId.startsWith('free_');
                    const expired = !!l.expiresAt && l.expiresAt.getTime() < Date.now();
                    return (
                      <tr key={l.id} className="border-t border-black/5 align-top">
                        <td className="py-3 pr-3 font-mono text-xs whitespace-nowrap">{l.licenseKey}</td>
                        <td className="py-3 pr-3 capitalize">{l.plan}</td>
                        <td className="py-3 pr-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${free ? 'bg-primary/15 text-black' : 'bg-black text-white'}`}>{free ? 'Free' : 'Paid'}</span>
                        </td>
                        <td className="py-3 pr-3 max-w-[200px] break-words">
                          {l.email || <span className="text-muted-foreground">—</span>}
                          {l.note && <div className="text-xs text-muted-foreground">{l.note}</div>}
                        </td>
                        <td className="py-3 pr-3">{l._count.activations}{l.plan === 'pro' ? ' / 1' : ''}</td>
                        <td className="py-3 pr-3 whitespace-nowrap">{fmtDate(l.expiresAt)}</td>
                        <td className="py-3 pr-3 capitalize whitespace-nowrap">{expired ? 'expired' : l.status.replace('_', ' ')}</td>
                        <td className="py-3">
                          <form action={setLicenceStatus}>
                            <input type="hidden" name="id" value={l.id} />
                            <input type="hidden" name="status" value={l.status === 'revoked' ? 'active' : 'revoked'} />
                            <button type="submit" className="text-xs font-semibold text-primary hover:text-black whitespace-nowrap">
                              {l.status === 'revoked' ? 'Reactivate' : 'Revoke'}
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-fade-soft px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">{children}</div>
    </main>
  );
}
