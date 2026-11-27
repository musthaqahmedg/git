import Link from 'next/link';
import { buttonStyles } from '@/components/ui/button';

const services = ['Driving', 'Plumbing', 'Electrical', 'Carpentry', 'Cleaning'];

const steps = [
  {
    title: 'Post the job',
    body: 'Say what you need, where, and what you will pay.',
  },
  {
    title: 'A nearby worker accepts',
    body: 'Workers close to you see the job and take it.',
  },
  {
    title: 'Pay in the app',
    body: 'Pay once the work is done. No cash haggling.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="bg-turmeric">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:pb-16 sm:pt-16">
          <h1 className="type-board max-w-3xl text-[2.75rem] text-ink sm:text-7xl">
            Help from someone nearby.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80 sm:text-xl">
            Drivers, plumbers, electricians and more, from your own part of Palakkad. Post
            what you need and a local worker takes the job.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth?type=customer" className={buttonStyles({ variant: 'board', size: 'lg' })}>
              I need help
            </Link>
            <Link href="/auth?type=driver" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
              I want work
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="Services">
            {services.map((s) => (
              <li
                key={s}
                className="rounded-[var(--radius-board)] border-2 border-ink/80 px-3 py-1 text-sm font-semibold text-ink"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="type-wide text-2xl font-bold text-paddy sm:text-3xl">How booking works</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t-4 border-paddy pt-4">
              <span className="type-board text-4xl text-turmeric [-webkit-text-stroke:1.5px_var(--color-paddy)]">
                {i + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-[var(--radius-board)] bg-leaf p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-paddy">Looking for work?</h2>
            <p className="mt-1 max-w-md text-muted">
              See jobs posted near you and take the ones that suit you.
            </p>
          </div>
          <Link
            href="/auth?type=driver"
            className={buttonStyles({ variant: 'primary', className: 'mt-4 w-full sm:mt-0 sm:w-auto' })}
          >
            See jobs near you
          </Link>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted">Made in Palakkad, Kerala.</div>
      </footer>
    </main>
  );
}
