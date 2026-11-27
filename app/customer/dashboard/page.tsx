'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const services = ['Car Ride', 'Plumbing', 'Electrical Work', 'Carpentry', 'Cleaning'];

const inputClass =
  'h-12 w-full rounded-[var(--radius-control)] border-2 border-line bg-white px-4 text-base outline-none focus:border-paddy';

export default function CustomerDashboard() {
  const router = useRouter();
  const [service, setService] = useState(services[0]);
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [name, setName] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [posted, setPosted] = useState<{ service: string; location: string } | null>(null);

  const postJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    setError('');
    try {
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_type: service, location, pay: Number(pay), customer_name: name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setPosted({ service, location });
      setLocation('');
      setPay('');
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Could not post the job. Try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <h1 className="type-board text-4xl text-paddy">Book help</h1>
        <Button variant="quiet" size="sm" onClick={() => router.push('/')}>
          Log out
        </Button>
      </div>

      {posted && (
        <div role="status" className="mt-6 rounded-[var(--radius-board)] bg-turmeric-soft px-5 py-4">
          <p className="font-bold">Job posted</p>
          <p className="text-muted">
            {posted.service} at {posted.location}. Nearby workers can see it now.
          </p>
        </div>
      )}

      <form onSubmit={postJob} className="mt-8 space-y-6">
        <fieldset>
          <legend className="mb-2 font-semibold">What do you need?</legend>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <label
                key={s}
                className={cn(
                  'cursor-pointer rounded-[var(--radius-control)] border-2 px-4 py-2 font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-turmeric',
                  service === s ? 'border-paddy bg-paddy text-white' : 'border-line bg-white text-ink hover:border-paddy'
                )}
              >
                <input
                  type="radio"
                  name="service"
                  value={s}
                  checked={service === s}
                  onChange={() => setService(s)}
                  className="sr-only"
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block font-semibold">Where?</span>
          <input
            required
            placeholder="e.g. Olavakkode, near the railway station"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-semibold">How much will you pay?</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted">₹</span>
            <input
              required
              type="number"
              inputMode="numeric"
              min={1}
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              className={cn(inputClass, 'pl-9')}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block font-semibold">Your name</span>
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-[var(--radius-control)] bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={posting} className="w-full">
          {posting ? 'Posting…' : 'Post job'}
        </Button>
      </form>
    </main>
  );
}
