import Link from 'next/link';
import {
  MapPin, BadgeCheck, Trophy, Calendar, Mail, FileText, ChevronRight,
  Terminal, Linkedin, Github, Instagram, Link as LinkIcon, ExternalLink, QrCode,
} from './icons';
import ThemeToggle from './ThemeToggle';
import ResumeButton from './ResumeModal';
import TechGroups from './TechGroups';
import GlassLink from './GlassLink';
import ProjectPicker from './ProjectPicker';
import AppStack from './AppStack';
import { BrandMark, TechLogo, issuerLogoName } from './logos';

export function ViewAll({ href }) {
  return (
    <Link href={href} className="link-action inline-flex items-center gap-0.5 text-sm flex-shrink-0">
      View all <ChevronRight size={14} />
    </Link>
  );
}

// A section's heading. On a phone the section follows the Malaya page pattern:
// a spaced eyebrow and a title sit on the page, and the content is the white
// card under them (.sec / .sec-body in globals.css). From 640px up the whole
// section is one card again and the eyebrow goes away.
function SecHead({ eyebrow, title, action, phoneOnly = false }) {
  return (
    <div className={`sec-head flex items-end justify-between gap-3 sm:mb-4${phoneOnly ? ' sm:hidden' : ''}`}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1 sm:hidden">{eyebrow}</p>}
        <h2 className="text-[22px] leading-tight font-semibold tracking-tight sm:text-xl sm:font-bold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Header({ profile }) {
  const p = profile || {};
  const roles = (p.headline || '').split('\\').map((s) => s.trim()).filter(Boolean);
  return (
    <header className="animate-fade-in grid grid-cols-[auto,minmax(0,1fr)] items-center gap-x-4 md:gap-x-6">
      {p.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.avatar_url} alt={p.name}
          className="sm:row-span-2 rounded-2xl w-[72px] h-[72px] sm:w-28 sm:h-28 md:w-40 md:h-40 object-cover" />
      ) : (
        <div className="sm:row-span-2 rounded-2xl w-[72px] h-[72px] sm:w-28 sm:h-28 md:w-40 md:h-40 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-2xl sm:text-3xl font-bold text-zinc-400">
          {(p.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </div>
      )}

      <div className="min-w-0 sm:self-end">
        {p.location && <p className="eyebrow mb-1 sm:hidden">{p.location}</p>}
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-xl md:text-2xl font-semibold sm:font-bold leading-snug tracking-tight sm:tracking-normal">
            {p.name}
            {/* Inline so the check stays on the line with the last word when the name wraps. */}
            {p.verified && <BadgeCheck size={20} className="accent-ink text-blue-500 inline-block align-[-3px] ml-1.5" />}
          </h1>
          {/* On a phone the theme switch lives in the top bar's pill. */}
          <span className="max-sm:hidden"><ThemeToggle /></span>
        </div>
        {p.location && (
          <p className="hidden sm:flex items-center gap-1 text-sm text-zinc-500 mt-1">
            <MapPin size={14} /> {p.location}
          </p>
        )}
      </div>

      <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:self-start min-w-0 mt-4 sm:mt-2">
        {/* Phone: what he does, as soft chips. */}
        <div className="flex flex-wrap items-center gap-1.5 sm:hidden">
          {roles.map((r) => <span key={r} className="chip !text-xs !py-1 !px-2.5">{r}</span>)}
        </div>
        <div className="hidden sm:flex flex-wrap items-center justify-between gap-2">
          {p.headline && <p className="text-sm md:text-base font-medium">{p.headline}</p>}
          {p.badge_text && (
            <a href={p.badge_url || '#'} target="_blank" rel="noreferrer"
              className="badge-accent inline-flex items-center gap-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 px-3 py-1.5 rounded-full">
              <Trophy size={13} /> {p.badge_text}
            </a>
          )}
        </div>
        {p.badge_text && (
          <a href={p.badge_url || '#'} target="_blank" rel="noreferrer"
            className="badge-accent sm:hidden mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-3 py-1.5 rounded-full">
            <Trophy size={13} /> {p.badge_text}
          </a>
        )}
        {/* Glass buttons (glisse). Phone: the main step fills the row, the
            other two share the next one. */}
        <div className="header-actions grid grid-cols-2 gap-2 mt-4 sm:flex sm:flex-wrap sm:items-center">
          {p.calendly_url && (
            <GlassLink href={p.calendly_url} external variant="filled" icon={<Calendar size={16} />} className="col-span-2">
              Schedule a Call
            </GlassLink>
          )}
          {p.email && (
            <GlassLink href={`mailto:${p.email}`} icon={<Mail size={16} />}>Send Email</GlassLink>
          )}
          <ResumeButton profile={p} />
          {p.blog_url && (
            <GlassLink href={p.blog_url} external icon={<FileText size={16} />}>Read my blog</GlassLink>
          )}
        </div>
      </div>
    </header>
  );
}

export function About({ profile }) {
  const paragraphs = (profile?.about || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <section className="sec">
      <SecHead eyebrow="Profile" title="About" />
      <div className="sec-body space-y-4 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
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

// Scale a #rgb / #rrggbb hex toward black (factor < 1). Returns an rgb() string,
// or null if the input isn't a valid hex so we can fall back to the default look.
function shade(hex, factor) {
  if (!hex) return null;
  const m = hex.replace('#', '');
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  if (!/^[0-9a-fA-F]{6}$/.test(n)) return null;
  const c = (i) => Math.round(parseInt(n.slice(i, i + 2), 16) * factor);
  return `rgb(${c(0)}, ${c(2)}, ${c(4)})`;
}

function AccessCard({ h }) {
  // A custom card_color renders as a tasteful dark gradient of that hue so the
  // white text stays readable on any colour the user picks.
  const tinted = shade(h.card_color, 0.9)
    ? { background: `linear-gradient(135deg, ${shade(h.card_color, 0.9)}, ${shade(h.card_color, 0.5)}, ${shade(h.card_color, 0.3)})` }
    : undefined;
  return (
    <div
      className={`rounded-[1.25rem] sm:rounded-2xl text-white p-6 font-mono shadow-lg ${tinted ? '' : 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black'}`}
      style={tinted}
    >
      <Terminal size={28} className="mb-10 opacity-90" />
      <p className="text-xl font-bold tracking-wide">{h.title}</p>
      {!h.hide_label && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 mt-1">Access Card</p>
      )}
      <div className={`flex items-end justify-between ${h.hide_label ? 'mt-6' : 'mt-10'}`}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">{h.subtitle}</p>
          <p className="text-sm font-semibold mt-1">{h.member_name}</p>
        </div>
        {h.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={h.image_url}
            alt={h.title || 'Logo'}
            className="w-14 h-14 rounded-lg object-contain bg-white/10 p-1.5"
          />
        ) : (
          <QrCode size={48} className="text-white/50" />
        )}
      </div>
    </div>
  );
}

function HighlightImage({ h }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={h.image_url} alt={h.title || 'Highlight'} className="w-full rounded-2xl" />
  );
  return h.link_url ? <a href={h.link_url} target="_blank" rel="noreferrer">{img}</a> : img;
}

export function Stats({ items }) {
  if (!items?.length) return null;
  return (
    <section className="sec">
      <SecHead eyebrow="Results" title="By the numbers" phoneOnly />
      {/* Phone: two-column stat tiles. Wider: one strip. */}
      <div className="sec-body grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-around sm:gap-x-8 sm:gap-y-6 sm:text-center">
        {items.map((s) => (
          <div key={s.id} className="stat-tile sm:min-w-[8rem]">
            <p className="accent-ink text-2xl sm:text-3xl font-semibold sm:font-bold tracking-tight">{s.value}</p>
            <p className="text-[13px] sm:text-sm leading-snug text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Experience({ items }) {
  return (
    <section className="sec">
      <SecHead eyebrow="Journey" title="Experience" />
      <ol className="sec-body space-y-5">
        {items.map((e) => (
          <li key={e.id} className="rail-item relative flex gap-3">
            <BrandMark src={e.logo_url} name={e.organization || e.title} size={36} />
            <div className="min-w-0">
              {/* Date on its own line above the title, so long labels never push
                  out of a narrow card. */}
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                {e.is_current && <span className="accent-bg w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" title="Current role" />}
                {e.year_label}
              </p>
              <p className="font-semibold text-[15px] leading-snug mt-0.5">{e.title}</p>
              <p className="text-sm text-zinc-500">{e.organization}</p>
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
  // The logos are drawn here and handed over ready-made, so the phone's tab
  // switch (a client component) never has to ship the icon paths itself.
  const groups = Object.entries(grouped).map(([cat, list]) => ({
    cat,
    items: list.map((t) => ({ id: t.id, name: t.name, logo: <TechLogo name={t.name} /> })),
  }));
  return (
    <section className="sec">
      <SecHead eyebrow="Toolkit" title="Tech Stack" action={!full && <ViewAll href="/tech-stack" />} />
      <TechGroups groups={groups} />
    </section>
  );
}

export function Projects({ items, full = false }) {
  const list = full ? items : items.filter((p) => p.featured);
  // Home: the photo-strip picker. /projects keeps the full grid below.
  if (!full) {
    const picked = list.map(({ id, slug, title, description, url, display_url, cover_image_url, published }) =>
      ({ id, slug, title, description, url, display_url, cover_image_url, published }));
    return (
      <section className="sec">
        <SecHead eyebrow="Work" title="Recent Projects" action={<ViewAll href="/projects" />} />
        <AppStack />
        <ProjectPicker items={picked} />
      </section>
    );
  }
  // /projects: the app stack, then every project as a cover card.
  return (
    <section className="sec">
      <SecHead eyebrow="Work" title="Projects" />
      <div className="sec-body">
        <AppStack />
        <div className="proj-grid">
          {list.map((p, i) => {
            const hasStory = !!p.slug && p.published !== false;
            const m = (p.title || '').match(/^(.+?)\s*(?:—|–|:)\s*(.+)$/);
            const [name, sub] = m ? [m[1], m[2]] : [p.title, ''];
            const cover = p.cover_image_url && /^\/work\/.+\.webp$/.test(p.cover_image_url)
              ? p.cover_image_url.replace(/\.webp$/, '-800.webp') : p.cover_image_url;
            const link = p.url && (p.display_url || p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
            return (
              <article key={p.id} className={`proj-card${hasStory ? ' proj-card-link' : ''}`}>
                <div className="proj-cover">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
                  ) : (
                    <span className="proj-cover-blank"><BrandMark src={p.logo_url} name={p.title} size={56} /></span>
                  )}
                  <span className="proj-no">No. {String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="proj-body">
                  <div className="flex items-center gap-2.5">
                    <BrandMark src={p.logo_url} name={p.title} size={32} />
                    <div className="min-w-0">
                      {hasStory ? (
                        <Link href={`/projects/${p.slug}`} className="block font-semibold leading-snug after:absolute after:inset-0 after:rounded-[1.25rem]">
                          {name}
                        </Link>
                      ) : (
                        <p className="font-semibold leading-snug">{name}</p>
                      )}
                      {sub && <p className="text-xs text-zinc-500 leading-snug">{sub}</p>}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-auto pt-4">
                    {hasStory && <span className="inline-flex items-center gap-1 text-xs font-medium">Read the story <ChevronRight size={12} /></span>}
                    {link && (
                      <a href={p.url} target="_blank" rel="noreferrer"
                        className="link-action relative z-10 inline-flex items-center gap-1 font-mono text-xs">
                        {link} <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Certifications({ items, full = false }) {
  const list = full ? items : items.filter((c) => c.featured);
  return (
    <section className="sec">
      <SecHead eyebrow="Credentials" title={full ? 'Certifications' : 'Recent Certifications'}
        action={!full && <ViewAll href="/certifications" />} />
      <ul className="sec-body space-y-2.5">
        {list.map((c) => {
          const logo = issuerLogoName(c.issuer);
          const body = (
            <div className={`${c.url ? 'tile-link' : 'tile'} flex items-center gap-3 px-3.5 py-3`}>
              {logo && (
                <span className="brand-mark rounded-xl" style={{ width: 36, height: 36 }} aria-hidden="true">
                  <TechLogo name={logo} size={18} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-snug">{c.title}</p>
                <p className="text-sm text-zinc-500">{c.issuer}</p>
              </div>
              {c.url && <ExternalLink size={14} className="text-zinc-500 flex-shrink-0" />}
            </div>
          );
          return (
            <li key={c.id}>
              {c.url ? <a href={c.url} target="_blank" rel="noreferrer" className="block">{body}</a> : body}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SOCIAL_ICONS = { linkedin: Linkedin, github: Github, instagram: Instagram };

export function MembershipCard({ m }) {
  return (
    <a href={m.url || '#'} target="_blank" rel="noreferrer"
      className="tile-link flex items-start justify-between gap-2 text-sm px-3.5 py-2.5">
      <span className="font-medium">{m.name}</span>
      <ExternalLink size={12} className="text-zinc-500 mt-0.5 flex-shrink-0" />
    </a>
  );
}

export function SocialLinkCard({ s }) {
  const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || LinkIcon;
  return (
    <a href={s.url} target="_blank" rel="noreferrer"
      className="tile-link flex items-center gap-2 text-sm font-medium px-3.5 py-2.5">
      <Icon size={15} /> {s.platform}
    </a>
  );
}

export function FooterGrid({ profile, memberships, socials }) {
  const p = profile || {};
  return (
    <section className="sec">
      <SecHead eyebrow="Contact" title="Get in touch" phoneOnly />
      <div className="sec-body grid md:grid-cols-3 gap-6 md:gap-8">
        <div>
          <h3 className="font-semibold text-sm mb-3">A member of</h3>
          <ul className="space-y-2">
            {memberships.map((m) => (
              <li key={m.id}><MembershipCard m={m} /></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Social Links</h3>
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.id}><SocialLinkCard s={s} /></li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          {p.email && (
            <a href={`mailto:${p.email}`} className="tile-link block text-sm px-3.5 py-2.5">
              <span className="flex items-center gap-1.5 text-zinc-500"><Mail size={13} /> Email</span>
              <span className="font-medium break-all">{p.email}</span>
            </a>
          )}
          {p.calendly_url && (
            <a href={p.calendly_url} target="_blank" rel="noreferrer" className="tile-link flex items-center justify-between text-sm px-3.5 py-2.5">
              <span>
                <span className="flex items-center gap-1.5 text-zinc-500"><Calendar size={13} /> Let&apos;s Talk</span>
                <span className="font-medium">Schedule a Call</span>
              </span>
              <ChevronRight size={14} />
            </a>
          )}
          <ResumeButton profile={p} variant="row" />
          {p.blog_url && (
            <a href={p.blog_url} target="_blank" rel="noreferrer" className="tile-link flex items-center justify-between text-sm px-3.5 py-2.5">
              <span>
                <span className="flex items-center gap-1.5 text-zinc-500"><FileText size={13} /> Blog</span>
                <span className="font-medium">Read my blog</span>
              </span>
              <ChevronRight size={14} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
