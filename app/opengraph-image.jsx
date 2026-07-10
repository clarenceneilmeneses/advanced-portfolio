import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/publicData';

// Social-share card (Open Graph / Twitter) generated from live CMS content.
// Edge runtime: the Node build of next/og breaks on Windows paths with spaces.
export const runtime = 'edge';
export const alt = 'Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const { profile } = await getPortfolioData();
  const name = profile?.name || 'Portfolio';
  const headline = (profile?.headline || '').split('\\').map((s) => s.trim()).filter(Boolean).join('  ·  ');
  const accent = profile?.accent_color || '#ffffff';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #27272a 100%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 96, height: 8, background: accent, borderRadius: 4, marginBottom: 40 }} />
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, letterSpacing: '-0.03em' }}>{name}</div>
        {headline && (
          <div style={{ display: 'flex', fontSize: 34, color: '#a1a1aa', marginTop: 24 }}>{headline}</div>
        )}
        {profile?.location && (
          <div style={{ display: 'flex', fontSize: 24, color: '#71717a', marginTop: 48 }}>{profile.location}</div>
        )}
      </div>
    ),
    size
  );
}
