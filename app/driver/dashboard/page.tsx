'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface Job {
  id: string;
  service_type: string;
  location: string;
  pay: number;
  customer_name: string;
  status: string;
}

const rupees = (n: number) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function DriverDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [accepting, setAccepting] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [rowError, setRowError] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/jobs/list');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setJobs(data.jobs || []);
      } catch {
        setLoadError('Could not load jobs. Refresh the page to try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const acceptJob = async (jobId: string) => {
    setAccepting(jobId);
    setRowError((e) => ({ ...e, [jobId]: '' }));
    try {
      const res = await fetch('/api/jobs/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error();
      setAccepted((s) => new Set(s).add(jobId));
    } catch {
      setRowError((e) => ({ ...e, [jobId]: 'Could not accept this job. Try again.' }));
    } finally {
      setAccepting(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="type-board text-4xl text-paddy">Jobs near you</h1>
          {!loading && !loadError && (
            <p className="mt-2 text-muted">
              {jobs.length === 1 ? '1 open job' : `${jobs.length} open jobs`} in Palakkad
            </p>
          )}
        </div>
        <Button variant="quiet" size="sm" onClick={() => router.push('/')}>
          Log out
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-muted">Loading jobs…</p>
        ) : loadError ? (
          <p role="alert" className="rounded-[var(--radius-control)] bg-danger/10 px-4 py-3 text-danger">
            {loadError}
          </p>
        ) : jobs.length === 0 ? (
          <div className="rounded-[var(--radius-board)] bg-leaf px-6 py-10 text-center">
            <p className="text-lg font-bold text-paddy">No open jobs right now</p>
            <p className="mt-1 text-muted">New jobs show up here as soon as customers post them.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {jobs.map((job) => {
              const done = accepted.has(job.id);
              return (
                <li key={job.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold">{job.service_type}</p>
                    <p className="text-muted">{job.location}</p>
                    {rowError[job.id] && (
                      <p role="alert" className="mt-1 text-sm text-danger">
                        {rowError[job.id]}
                      </p>
                    )}
                  </div>
                  <p className="type-wide text-2xl font-extrabold text-ink">{rupees(job.pay)}</p>
                  {done ? (
                    <span className="inline-flex h-11 items-center rounded-[var(--radius-control)] bg-leaf px-5 font-semibold text-paddy">
                      Accepted
                    </span>
                  ) : (
                    <Button onClick={() => acceptJob(job.id)} disabled={accepting === job.id}>
                      {accepting === job.id ? 'Accepting…' : 'Accept job'}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
