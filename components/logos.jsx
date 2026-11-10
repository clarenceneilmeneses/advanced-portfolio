import {
  siPostgresql, siSupabase, siPhp, siMysql, siPython, siReact, siTypescript, siNextdotjs,
  siTailwindcss, siJavascript, siHtml5, siCss, siGoogleanalytics, siGoogleads, siGithub,
  siVite, siVitest, siFigma, siShopify, siClaude, siExpo, siTanstack, siVercel, siLeaflet,
  siXendit, siNodedotjs, siBootstrap, siGsap, siGoogle, siCisco,
} from 'simple-icons';
import {
  BarChart3, ClipboardCheck, Clapperboard, Code2, Database, Map as MapIcon, Sheet, Smartphone, Webhook,
} from 'lucide-react';

// Logos are drawn in the text colour, never in their brand colours: the page is
// one neutral family with the accent as its only colour, so a row of logos
// reads as part of the page rather than a strip of stickers.

// Brand marks (simple-icons paths, 24×24). Keys are lower-cased names with
// anything in brackets dropped, so "Shopify (Liquid)" finds "shopify".
const BRAND = {
  postgresql: siPostgresql, supabase: siSupabase, php: siPhp, mysql: siMysql, python: siPython,
  react: siReact, typescript: siTypescript, 'next.js': siNextdotjs,
  'tailwind css': siTailwindcss, javascript: siJavascript, html5: siHtml5, css3: siCss, css: siCss,
  'google analytics': siGoogleanalytics, 'google ads': siGoogleads, 'git/github': siGithub,
  github: siGithub, vite: siVite, vitest: siVitest, figma: siFigma, shopify: siShopify,
  'claude code': siClaude, claude: siClaude, expo: siExpo, 'tanstack start': siTanstack,
  tanstack: siTanstack, vercel: siVercel, leaflet: siLeaflet, xendit: siXendit,
  'node.js': siNodedotjs, bootstrap: siBootstrap, gsap: siGsap, google: siGoogle, cisco: siCisco,
};

// Skills with no logo of their own (or whose owner doesn't publish one) get a plain glyph.
// React Native shares React's atom, and two identical tiles side by side read as a mistake.
const GLYPH = {
  'react native': Smartphone,
  'rest apis': Webhook, sql: Database, 'power bi': BarChart3, 'microsoft excel': Sheet,
  excel: Sheet, 'gis mapping': MapIcon, 'uat & system testing': ClipboardCheck,
  remotion: Clapperboard, 'motion graphics': Clapperboard,
};

const keyOf = (name) => (name || '').toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').trim();

export function TechLogo({ name, size = 22 }) {
  const key = keyOf(name);
  const brand = BRAND[key];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }
  const Glyph = GLYPH[key] || Code2;
  return <Glyph size={size} strokeWidth={1.75} aria-hidden="true" />;
}

// Issuer names are sentences ("Google Digital Academy (Skillshop)"), so match on a word.
export function issuerLogoName(issuer) {
  const s = (issuer || '').toLowerCase();
  if (s.includes('google')) return 'google';
  if (s.includes('cisco')) return 'cisco';
  return null;
}

// A company or project mark in a small tile.
//   *-mono.png    a silhouette, painted in the text colour through a CSS mask
//   tech:<name>   one of the tech logos above
//   anything else shown as a picture, greyed so it sits in the same family
//   no logo       the initials
export function BrandMark({ src, name, size = 40, round = false }) {
  const shape = round ? 'rounded-full' : 'rounded-xl';
  const box = { width: size, height: size };
  // "tech:shopify" borrows a tech logo, for work best known by its platform.
  if (src && src.startsWith('tech:')) {
    return (
      <span className={`brand-mark ${shape}`} style={box} aria-hidden="true">
        <TechLogo name={src.slice(5)} size={Math.round(size * 0.5)} />
      </span>
    );
  }
  if (!src) {
    const words = (name || '?').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
    // An acronym up front ("PDAO, City of…") is the name people know it by.
    const initials = /^[A-Z]{2,}$/.test(words[0] || '')
      ? words[0].slice(0, 2)
      : words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
    return (
      <span className={`brand-mark ${shape}`} style={{ ...box, fontSize: Math.round(size * 0.34) }} aria-hidden="true">
        {initials}
      </span>
    );
  }
  if (/-mono\.(png|svg|webp)(\?|$)/.test(src)) {
    const inset = Math.round(size * 0.2);
    const mask = `url("${src}") center / contain no-repeat`;
    return (
      <span className={`brand-mark ${shape}`} style={box} aria-hidden="true">
        <span style={{ width: size - inset * 2, height: size - inset * 2, background: 'currentColor', WebkitMask: mask, mask }} />
      </span>
    );
  }
  return (
    <span className={`brand-mark ${shape} overflow-hidden`} style={box} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async"
        className="w-full h-full object-cover grayscale" />
    </span>
  );
}
