import Link from 'next/link';
import { siGoogleplay } from 'simple-icons';
import { ArrowRight } from './icons';

// The two PapaFix apps, both live on Google Play, as a pair of app cards side
// by side (two columns on every screen). Every tag is a plain fact, no rankings.
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
          <article key={a.key} className="app-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.icon} alt="" width="64" height="64" className="app-icon" />
            <p className="app-name">{a.name}<span>{a.kind}</span></p>
            <div className="app-tags">
              {a.tags.map((t) => <span key={t} className="app-tag">{t}</span>)}
            </div>
            <p className="app-text">{a.text}</p>
            <PlayBadge href={a.play} label={`${a.name} ${a.kind}`} />
          </article>
        ))}
      </div>
      <p className="apps-foot">
        Both apps redesigned by me in November 2026.{' '}
        <Link href={story} className="link-action inline-flex items-center gap-1">Read the story <ArrowRight size={12} /></Link>
      </p>
    </div>
  );
}
