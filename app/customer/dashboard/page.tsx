'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { resizeImage } from '@/lib/resize-image';

export const dynamic = 'force-dynamic';

const services = ['Car Ride', 'Plumbing', 'Electrical Work', 'Carpentry', 'Cleaning'];

const examples: Record<string, { describe: string; bring: string }> = {
  'Car Ride': { describe: 'Drive my car from Olavakkode to Kochi airport. Leave at 6 am.', bring: 'Driving licence' },
  Plumbing: { describe: 'Kitchen tap is leaking and the sink drains slowly.', bring: 'Pipe wrench, spare washers' },
  'Electrical Work': { describe: 'Two ceiling fans not working. One switch sparks.', bring: 'Tester, spare switch' },
  Carpentry: { describe: 'Cupboard door hinge is broken and needs fixing.', bring: 'Drill, screws' },
  Cleaning: { describe: '2-bedroom flat: kitchen, 2 bathrooms and all floors.', bring: 'Mop and bucket' },
};

const MAX_PHOTOS = 3;

type Photo = { id: string; preview: string; url?: string; status: 'uploading' | 'done' | 'error' };

const inputClass =
  'h-12 w-full rounded-[var(--radius-control)] border-2 border-line bg-white px-4 text-base outline-none focus:border-paddy';

export default function CustomerDashboard() {
  const router = useRouter();
  const [service, setService] = useState(services[0]);
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bring, setBring] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploading = photos.some((p) => p.status === 'uploading');

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files).slice(0, room);

    for (const file of picked) {
      const id = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      setPhotos((ps) => [...ps, { id, preview, status: 'uploading' }]);
      try {
        const body = new FormData();
        body.append('photo', await resizeImage(file), 'photo.jpg');
        const res = await fetch('/api/jobs/upload-photo', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, url: data.url, status: 'done' } : p)));
      } catch {
        setPhotos((ps) => ps.map((p) => (p.id === id ? { ...p, status: 'error' } : p)));
      }
    }
    if (fileInput.current) fileInput.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos((ps) => {
      const gone = ps.find((p) => p.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return ps.filter((p) => p.id !== id);
    });
  };
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
        body: JSON.stringify({
          service_type: service,
          location,
          pay: Number(pay),
          customer_name: name,
          description,
          bring,
          photos: photos.filter((p) => p.status === 'done').map((p) => p.url),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      setPosted({ service, location });
      setLocation('');
      setPay('');
      setDescription('');
      setBring('');
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos([]);
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
          <span className="mb-1 block font-semibold">Describe the job</span>
          <span className="mb-2 block text-sm text-muted">Optional. Helps the worker know what to expect.</span>
          <textarea
            rows={3}
            maxLength={1000}
            placeholder={`e.g. ${examples[service].describe}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-[var(--radius-control)] border-2 border-line bg-white px-4 py-3 text-base outline-none focus:border-paddy"
          />
        </label>

        <label className="block">
          <span className="mb-1 block font-semibold">What should they bring?</span>
          <span className="mb-2 block text-sm text-muted">Optional.</span>
          <input
            maxLength={300}
            placeholder={`e.g. ${examples[service].bring}`}
            value={bring}
            onChange={(e) => setBring(e.target.value)}
            className={inputClass}
          />
        </label>

        <div>
          <p className="mb-1 font-semibold">Photos</p>
          <p className="mb-2 text-sm text-muted">Optional. Up to {MAX_PHOTOS} photos of the job.</p>
          <div className="flex flex-wrap gap-3">
            {photos.map((p) => (
              <div key={p.id} className="relative h-24 w-24 overflow-hidden rounded-[var(--radius-control)] border-2 border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview} alt="" className={cn('h-full w-full object-cover', p.status === 'uploading' && 'opacity-50')} />
                {p.status === 'uploading' && (
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-0.5 text-center text-xs text-white">Uploading…</span>
                )}
                {p.status === 'error' && (
                  <span className="absolute inset-x-0 bottom-0 bg-danger py-0.5 text-center text-xs text-white">Failed</span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(p.id)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80 text-sm font-bold text-white hover:bg-ink"
                >
                  ✕
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="grid h-24 w-24 place-items-center rounded-[var(--radius-control)] border-2 border-dashed border-paddy/50 bg-white text-center text-sm font-semibold text-paddy hover:border-paddy"
              >
                + Add photo
              </button>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => addPhotos(e.target.files)}
            className="sr-only"
            tabIndex={-1}
          />
        </div>

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

        <Button type="submit" size="lg" disabled={posting || uploading} className="w-full">
          {posting ? 'Posting…' : uploading ? 'Uploading photos…' : 'Post job'}
        </Button>
      </form>
    </main>
  );
}
