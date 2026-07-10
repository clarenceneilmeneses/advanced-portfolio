import { Header, About, Highlights, Experience, TechStack, Projects, Certifications, FooterGrid } from './sections';
import Gallery from './Gallery';

// Default bento layout — shared by the public homepage and the admin editor/preview.
export const DEFAULT_LAYOUT = [
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

// Turn profile.accent_color into CSS variables. Picks a readable text colour
// for elements painted with the accent. Returns null if unset/invalid.
export function accentStyle(hex) {
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

export function renderSection(key, data) {
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
