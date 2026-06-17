import { getPortfolioData } from '@/lib/publicData';
import { Header, About, Highlights, Experience, TechStack, Projects, Certifications, FooterGrid } from '@/components/sections';
import Gallery from '@/components/Gallery';
import BentoGrid from '@/components/BentoGrid';
import Link from 'next/link';

// ISR: regenerated in the background at most once a minute.
export const revalidate = 60;

export async function generateMetadata() {
  const { profile } = await getPortfolioData();
  const name = profile?.name || 'Portfolio';
  const title = `${name} - ${profile?.headline?.split('\\')[1]?.trim() || 'Portfolio'}`;
  const description = (profile?.about || '').split(/\n/)[0].slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile?.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: { card: 'summary', title, description },
  };
}

// Default bento layout — must match DEFAULT_LAYOUT in app/admin/page.jsx
const DEFAULT_LAYOUT = [
  { i: 'header',         x: 0, y: 0,  w: 4, h: 1, visible: true },
  { i: 'about',          x: 0, y: 1,  w: 2, h: 2, visible: true },
  { i: 'highlights',     x: 2, y: 1,  w: 2, h: 2, visible: true },
  { i: 'tech_stack',     x: 0, y: 3,  w: 4, h: 1, visible: true },
  { i: 'projects',       x: 0, y: 4,  w: 3, h: 2, visible: true },
  { i: 'experience',     x: 3, y: 4,  w: 1, h: 2, visible: true },
  { i: 'certifications', x: 0, y: 6,  w: 2, h: 1, visible: true },
  { i: 'gallery',        x: 0, y: 7,  w: 4, h: 1, visible: true },
  { i: 'footer',         x: 0, y: 8,  w: 4, h: 1, visible: true },
];

// Turn profile.accent_color into CSS variables for <main>. Picks a readable
// text colour for elements painted with the accent. Returns null if unset/invalid.
function accentStyle(hex) {
  if (!hex) return null;
  const m = hex.replace('#', '');
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  if (!/^[0-9a-fA-F]{6}$/.test(n)) return null;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return { '--accent': `#${n}`, '--accent-contrast': luminance > 0.6 ? '#000000' : '#ffffff' };
}

function renderSection(key, data) {
  const { profile, tech, projects, experiences, certs, memberships, socials, gallery, highlights } = data;
  switch (key) {
    case 'header':
      return (
        <div className="glass-panel p-6">
          <Header profile={profile} />
        </div>
      );
    case 'about':
      return <About profile={profile} />;
    case 'highlights':
      return highlights?.length > 0 ? <Highlights items={highlights} /> : null;
    case 'tech_stack':
      return <TechStack items={tech} />;
    case 'projects':
      return <Projects items={projects} />;
    case 'experience':
      return <Experience items={experiences} />;
    case 'certifications':
      return <Certifications items={certs} />;
    case 'gallery':
      return gallery?.length > 0 ? (
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4">Gallery</h2>
          <Gallery items={gallery} />
        </section>
      ) : null;
    case 'footer':
      return <FooterGrid profile={profile} memberships={memberships} socials={socials} />;
    default:
      return null;
  }
}

export default async function Home() {
  const data = await getPortfolioData();
  const { profile, socials } = data;

  if (!profile) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold">Nothing here yet</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Run <code className="font-mono">supabase/schema.sql</code> and{' '}
          <code className="font-mono">supabase/seed.sql</code> in your Supabase SQL editor,
          then manage content from the{' '}
          <Link href="/admin" className="underline">admin panel</Link>.
        </p>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location,
    image: profile.avatar_url || undefined,
    jobTitle: profile.headline,
    sameAs: socials.map((s) => s.url),
  };

  // Support both new bento format (array) and old section_config format (object)
  const rawConfig = profile.section_config;
  const layout = Array.isArray(rawConfig)
    ? rawConfig
    : DEFAULT_LAYOUT;

  const visibleItems = layout
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const accent = accentStyle(profile.accent_color);

  return (
    <main className={`max-w-5xl mx-auto px-4 py-8${accent ? ' accent-on' : ''}`} style={accent || undefined}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <BentoGrid
        items={visibleItems
          .map((s) => ({ i: s.i, x: s.x, w: s.w, h: s.h, node: renderSection(s.i, data) }))
          .filter((it) => it.node)}
      />

      <footer className="text-center text-sm text-zinc-500 mt-12 pb-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-6">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
        {' · '}
        <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-zinc-200">Admin</Link>
      </footer>
    </main>
  );
}
