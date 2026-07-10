import { getPortfolioData } from '@/lib/publicData';
import { DEFAULT_LAYOUT, accentStyle, renderSection } from '@/components/portfolioSections';
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
      </footer>
    </main>
  );
}
