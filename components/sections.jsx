import Link from 'next/link';
import {
  MapPin, BadgeCheck, Trophy, Calendar, Mail, FileText, ChevronRight,
  Terminal, Linkedin, Github, Instagram, Link as LinkIcon, ExternalLink, QrCode,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export function ViewAll({ href }) {
  return (
    <Link href={href} className="flex items-center gap-0.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
      View All <ChevronRight size={14} />
    </Link>
  );
}

export function Header({ profile }) {
  const p = profile || {};
  return (
    <header className="animate-fade-in">
      <div className="flex items-start md:items-center gap-4 md:gap-6">
        {p.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.avatar_url} alt={p.name} className="rounded-lg w-28 h-28 md:w-40 md:h-40 object-cover flex-shrink-0" />
        ) : (
          <div className="rounded-lg w-28 h-28 md:w-40 md:h-40 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400">
            {(p.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg md:text-2xl font-bold truncate flex items-center gap-1.5">
              {p.name}
              {p.verified && <BadgeCheck size={20} className="text-blue-500 flex-shrink-0" fill="currentColor" stroke="white" />}
            </h1>
            <ThemeToggle />
          </div>
          {p.location && (
            <p className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
              <MapPin size={14} /> {p.location}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            {p.headline && <p className="text-sm md:text-base font-medium">{p.headline}</p>}
            {p.badge_text && (
              <a href={p.badge_url || '#'} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 px-3 py-1.5 rounded-md">
                <Trophy size={13} /> {p.badge_text}
              </a>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {p.calendly_url && (
              <a href={p.calendly_url} target="_blank" rel="noreferrer" className="btn-primary">
                <Calendar size={15} /> Schedule a Call <ChevronRight size={14} />
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="btn-ghost">
                <Mail size={15} /> Send Email
              </a>
            )}
            {p.blog_url && (
              <a href={p.blog_url} target="_blank" rel="noreferrer" className="btn-ghost">
                <FileText size={15} /> Read my blog
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function About({ profile }) {
  const paragraphs = (profile?.about || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <section className="card p-6">
      <h2 className="section-title mb-3">About</h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        {paragraphs.map((t, i) => <p key={i}>{t}</p>)}
      </div>
    </section>
  );
}

export function Highlights({ items }) {
  if (!items.length) return null;
  return (
    <div className="space-y-3">
      {items.map((h) =>
        h.kind === 'access_card' ? <AccessCard key={h.id} h={h} /> : <HighlightImage key={h.id} h={h} />
      )}
    </div>
  );
}

function AccessCard({ h }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white p-6 font-mono shadow-lg">
      <Terminal size={28} className="mb-10" />
      <p className="text-xl font-bold tracking-wide">{h.title}</p>
      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mt-1">Access Card</p>
      <div className="flex items-end justify-between mt-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{h.subtitle}</p>
          <p className="text-sm font-semibold mt-1">{h.member_name}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-6">Developer</p>
        </div>
        <QrCode size={48} className="text-zinc-400" />
      </div>
    </div>
  );
}

function HighlightImage({ h }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={h.image_url} alt={h.title || 'Highlight'} className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800" />
  );
  return h.link_url ? <a href={h.link_url} target="_blank" rel="noreferrer">{img}</a> : img;
}

export function Experience({ items }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl font-bold tracking-tight mb-5">Experience</h2>
      <ol className="relative border-l border-zinc-200 dark:border-zinc-800 ml-1.5 space-y-6">
        {items.map((e) => (
          <li key={e.id} className="pl-5 relative">
            <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-sm ${e.is_current ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600'}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[15px]">{e.title}</p>
                <p className="text-sm text-zinc-500">{e.organization}</p>
              </div>
              <span className="text-xs text-zinc-400 mt-0.5 flex-shrink-0">{e.year_label}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TechStack({ items, full = false }) {
  const grouped = {};
  for (const t of items) {
    if (!full && !t.featured) continue;
    (grouped[t.category] ||= []).push(t);
  }
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight">Tech Stack</h2>
        {!full && <ViewAll href="/tech-stack" />}
      </div>
      <div className="space-y-5">
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat}>
            <h3 className="font-semibold text-sm mb-2">{cat}</h3>
            <div className="flex flex-wrap gap-2">
              {list.map((t) => <span key={t.id} className="chip">{t.name}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Projects({ items, full = false }) {
  const list = full ? items : items.filter((p) => p.featured);
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight">{full ? 'Projects' : 'Recent Projects'}</h2>
        {!full && <ViewAll href="/projects" />}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((p) => {
          const hasStory = !!p.slug && p.published !== false;
          return (
            <div key={p.id} className="glass-card relative p-4">
              <div className="flex items-start justify-between gap-2">
                {hasStory ? (
                  <Link href={`/projects/${p.slug}`} className="font-semibold after:absolute after:inset-0">
                    {p.title}
                  </Link>
                ) : (
                  <p className="font-semibold">{p.title}</p>
                )}
                {hasStory && <ChevronRight size={15} className="text-zinc-400 mt-1 flex-shrink-0" />}
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">{p.description}</p>
              <div className="flex items-center gap-2 mt-3">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer"
                    className="relative z-10 inline-flex items-center gap-1 font-mono text-xs px-2 py-1 glass-card text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">
                    {p.display_url || p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
                {hasStory && <span className="text-xs text-zinc-400">Read the story</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Certifications({ items, full = false }) {
  const list = full ? items : items.filter((c) => c.featured);
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">{full ? 'Certifications' : 'Recent Certifications'}</h2>
        {!full && <ViewAll href="/certifications" />}
      </div>
      <ul className="space-y-2.5">
        {list.map((c) => {
          const body = (
            <div className="glass-card flex items-center justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-semibold text-sm">{c.title}</p>
                <p className="text-sm text-zinc-500">{c.issuer}</p>
              </div>
              {c.url && <ExternalLink size={14} className="text-zinc-400 flex-shrink-0" />}
            </div>
          );
          return (
            <li key={c.id}>
              {c.url ? <a href={c.url} target="_blank" rel="noreferrer" className="block hover:opacity-80">{body}</a> : body}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SOCIAL_ICONS = { linkedin: Linkedin, github: Github, instagram: Instagram };

export function FooterGrid({ profile, memberships, socials }) {
  const p = profile || {};
  return (
    <section className="card p-6 grid md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold text-sm mb-3">A member of</h3>
        <ul className="space-y-2">
          {memberships.map((m) => (
            <li key={m.id}>
              <a href={m.url || '#'} target="_blank" rel="noreferrer"
                className="glass-card flex items-start justify-between gap-2 text-sm px-3 py-2.5">
                <span className="font-medium">{m.name}</span>
                <ExternalLink size={12} className="text-zinc-400 mt-0.5 flex-shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Social Links</h3>
        <ul className="space-y-2">
          {socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] || LinkIcon;
            return (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer"
                  className="glass-card flex items-center gap-2 text-sm px-3 py-2.5">
                  <Icon size={15} /> {s.platform}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Speaking</h3>
        <div className="glass-card p-3.5 text-sm text-zinc-600 dark:text-zinc-300">
          <p>{p.speaking_text}</p>
          {p.email && (
            <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1 font-medium mt-3 hover:text-zinc-900 dark:hover:text-white">
              Get in touch <ChevronRight size={13} />
            </a>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {p.email && (
          <a href={`mailto:${p.email}`} className="block text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
            <span className="flex items-center gap-1.5 text-zinc-500"><Mail size={13} /> Email</span>
            <span className="font-medium">{p.email}</span>
          </a>
        )}
        {p.calendly_url && (
          <a href={p.calendly_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2.5 hover:text-zinc-900 dark:hover:text-white">
            <span>
              <span className="flex items-center gap-1.5 text-zinc-500"><Calendar size={13} /> Let&apos;s Talk</span>
              <span className="font-medium">Schedule a Call</span>
            </span>
            <ChevronRight size={14} />
          </a>
        )}
        {p.blog_url && (
          <a href={p.blog_url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm hover:text-zinc-900 dark:hover:text-white">
            <span>
              <span className="flex items-center gap-1.5 text-zinc-500"><FileText size={13} /> Blog</span>
              <span className="font-medium">Read my blog</span>
            </span>
            <ChevronRight size={14} />
          </a>
        )}
      </div>
    </section>
  );
}
