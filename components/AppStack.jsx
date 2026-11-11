'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { siGoogleplay } from 'simple-icons';
import { ArrowRight } from './icons';

// The two PapaFix apps, both live on Google Play, as a pair of app cards side
// by side (two columns on every screen), each hanging from a pin above it.
// Every tag is a plain fact, no rankings.
//
// The hang has two layers: .app-hang sways on its own in CSS, and the card
// inside it answers the pointer. With a mouse the card leans toward the
// cursor and swings back to rest when it leaves; a tap flicks it into a
// swing that dies out. Nothing moves with reduced motion.
const APPS = [
  {
    key: 'customer',
    name: 'PapaFix',
    kind: 'Customer app',
    icon: '/work/papafix/icon-customer.webp',
    tags: ['Home repairs'],
    text: 'Book a trusted aircon, plumbing or electrical technician in a few taps.',
    play: 'https://play.google.com/store/apps/details?id=com.papafix.customer',
  },
  {
    key: 'technician',
    name: 'PapaFix',
    kind: 'Technician app',
    icon: '/work/papafix/icon-technician.webp',
    tags: ['For technicians'],
    text: 'Take jobs, set your hours and follow every repair to the end.',
    play: 'https://play.google.com/store/apps/details?id=com.papafix.technician',
  },
];

function PlayBadge({ href, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="play-badge" aria-label={`Get ${label} on Google Play`}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d={siGoogleplay.path} fill="currentColor" /></svg>
      <span><small>GET IT ON</small>Google Play</span>
    </a>
  );
}

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A damped swing from `from` degrees back to rest.
function settle(el, from, ms = 1100) {
  el.getAnimations().forEach((a) => a.cancel());
  el.style.transition = 'none';
  el.style.transform = '';
  el.animate(
    [from, -from * 0.55, from * 0.3, -from * 0.14, from * 0.05, 0].map((d) => ({ transform: `rotate(${d}deg)` })),
    { duration: ms, easing: 'ease-in-out' },
  );
}

function HangingCard({ children }) {
  const ref = useRef(null);
  const lean = useRef(0);
  // -0.5 (left edge) … 0.5 (right edge). The pin is above the card, so a
  // negative turn carries the bottom toward the right.
  const side = (e) => {
    const r = ref.current.getBoundingClientRect();
    return (e.clientX - r.left) / r.width - 0.5;
  };
  return (
    <div className="app-hang">
      <article ref={ref} className="app-card"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || still()) return;
          const el = ref.current;
          el.getAnimations().forEach((a) => a.cancel());
          lean.current = -side(e) * 7;
          el.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
          el.style.transform = `rotate(${lean.current}deg)`;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse' || still() || !lean.current) return;
          settle(ref.current, lean.current, 1000);
          lean.current = 0;
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse' || still()) return;
          settle(ref.current, -side(e) * 12, 1300);
        }}>
        {children}
      </article>
    </div>
  );
}

export default function AppStack({ story = '/projects/papafix-mobile' }) {
  return (
    <div className="apps">
      {/* What both apps share sits once above the pair. */}
      <div className="apps-tags app-tags">
        <span className="app-tag app-tag-main">❮ On Google Play ❯</span>
        <span className="app-tag">Made in the Philippines</span>
      </div>
      <div className="apps-pair">
        {APPS.map((a) => (
          <HangingCard key={a.key}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.icon} alt="" width="64" height="64" className="app-icon" />
            <p className="app-name">{a.name}<span>{a.kind}</span></p>
            <div className="app-tags">
              {a.tags.map((t) => <span key={t} className="app-tag">{t}</span>)}
            </div>
            <p className="app-text">{a.text}</p>
            <PlayBadge href={a.play} label={`${a.name} ${a.kind}`} />
          </HangingCard>
        ))}
      </div>
      <p className="apps-foot">
        Both apps redesigned by me in November 2026.{' '}
        <Link href={story} className="link-action inline-flex items-center gap-1">Read the story <ArrowRight size={12} /></Link>
      </p>
    </div>
  );
}
