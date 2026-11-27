'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Mode = 'login' | 'signup';
type Notice = { kind: 'error' | 'success'; text: string } | null;

const inputClass =
  'h-12 w-full rounded-[var(--radius-control)] border-2 border-line bg-white px-4 text-base outline-none focus:border-paddy';

function AuthForm() {
  const router = useRouter();
  const type = useSearchParams().get('type') === 'driver' ? 'driver' : 'customer';
  const isWorker = type === 'driver';

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNotice({ kind: 'error', text: data.error || 'Something went wrong. Try again.' });
        return;
      }

      if (mode === 'signup') {
        setMode('login');
        setNotice({ kind: 'success', text: 'Account created. Check your email to confirm it, then log in.' });
        return;
      }

      router.push(isWorker ? '/driver/dashboard' : '/customer/dashboard');
    } catch {
      setNotice({ kind: 'error', text: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="type-board text-4xl text-paddy">{isWorker ? 'Find work' : 'Book help'}</h1>
      <p className="mt-2 text-muted">
        {isWorker
          ? 'Log in to see jobs posted near you.'
          : 'Log in to post a job for a nearby worker.'}
      </p>

      <div role="tablist" className="mt-8 grid grid-cols-2 rounded-[var(--radius-control)] bg-leaf p-1">
        {(['login', 'signup'] as Mode[]).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              setNotice(null);
            }}
            className={cn(
              'h-10 rounded-[8px] font-semibold transition-colors',
              mode === m ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
            )}
          >
            {m === 'login' ? 'Log in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block font-semibold">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-semibold">Password</span>
          <input
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        {notice && (
          <p
            role={notice.kind === 'error' ? 'alert' : 'status'}
            className={cn(
              'rounded-[var(--radius-control)] px-4 py-3 text-sm font-medium',
              notice.kind === 'error' ? 'bg-danger/10 text-danger' : 'bg-leaf text-paddy'
            )}
          >
            {notice.text}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
