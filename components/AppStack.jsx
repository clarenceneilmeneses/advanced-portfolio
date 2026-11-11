'use client';
import { useState } from 'react';
import Link from 'next/link';
import { siGoogleplay } from 'simple-icons';
import { ArrowRight } from './icons';

// The two PapaFix apps, live on Google Play, as a fanned stack of app cards:
// the front card flat in the middle, the other tilted behind it. Tapping the
// back card brings it to the front. Every tag is a plain fact, no rankings.
const APPS = [
  {
    key: 'customer',
    name: 'PapaFix',
    kind: 'Customer app',
    icon: '/work/papafix/icon-customer.webp',
    tags: ['Home repairs', 'Made in the Philippines'],
    text: 'Book a trusted aircon, plumbing or electrical technician in a few taps.',
    play: 'https://play.google.com/store/apps/details?id=com.papafix.customer',
  },
  {
    key: 'technician',
    name: 'PapaFix',
    kind: 'Technician app',
    icon: '/work/papafix/icon-technician.webp',
    tags: ['For technicians', 'Made in the Philippines'],
    text: 'Take jobs, set your hours and follow every repair to the end.',
    play: 'https://play.google.com/store/apps/details?id=com.papafix.technician',
  },
];

function PlayBadge({ href, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="play-badge" aria-label={`Get ${label} on Google Play`}
      onClick={(e) => e.stopPropagation()}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={siGoogleplay.path} fill="currentColor" /></svg>
      <span><small>GET IT ON</small>Google Play</span>
    </a>
  );
}

export default function AppStack({ story = '/projects/papafix-mobile' }) {
  const [front, setFront] = useState(0);
  return (
    <div className="apps">
      <div className="apps-stage">
        {APPS.map((a, i) => {
          const isFront = i === front;
          return (
            <article key={a.key} className="app-card" data-front={isFront ? '' : undefined} data-side={i === 0 ? 'left' : 'right'}
              onClick={isFront ? undefined : () => setFront(i)}
              role={isFront ? undefined : 'button'} tabIndex={isFront ? undefined : 0}
              aria-label={isFront ? undefined : `Show the ${a.kind}`}
              onKeyDown={isFront ? undefined : (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setFront(i))}>
              <div className="app-tags">
                <span className="app-tag app-tag-main">❮ On Google Play ❯</span>
                {a.tags.map((t) => <span key={t} className="app-tag">{t}</span>)}
              </div>
              <div className="app-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.icon} alt="" width="64" height="64" className="app-icon" />
                <p className="app-name">{a.name} <span>— {a.kind}</span></p>
              </div>
              <p className="app-text">{a.text}</p>
              <PlayBadge href={a.play} label={`${a.name} ${a.kind}`} />
            </article>
          );
        })}
      </div>
      <p className="apps-foot">
        Both apps redesigned by me in November 2026.{' '}
        <Link href={story} className="link-action inline-flex items-center gap-1">Read the story <ArrowRight size={12} /></Link>
      </p>
    </div>
  );
}
