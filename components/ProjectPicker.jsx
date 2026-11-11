'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Glass } from 'glisse';
import { ArrowRight, ChevronRight, ExternalLink, Lock } from './icons';
import GlassLink from './GlassLink';

// Recent Projects as a picker: a stack of photo strips (number, name, what it
// is, a chevron), each a link to its story. From 1024px up a large preview
// card sits beside them and shows whichever strip is hovered or focused;
// below that the strips stand alone and a tap opens the story.

// "Malaya OBS — Villa Operations…" → ["Malaya OBS", "Villa Operations…"]
function splitTitle(title = '') {
  const m = title.match(/^(.+?)\s*(?:—|–|:)\s*(.+)$/);
  return m ? [m[1], m[2]] : [title, ''];
}

// Covers that ship with the site come with an 800px copy for the card and a
// wide photographic crop for the strip (no headline text under the name).
const shipped = (url) => !!url && /^\/work\/.+\.webp$/.test(url);
const small = (url) => (shipped(url) ? url.replace(/\.webp$/, '-800.webp') : url);
const strip = (url) => (shipped(url) ? url.replace(/\.webp$/, '-strip.webp') : url);

const no = (i) => String(i + 1).padStart(2, '0');

export default function ProjectPicker({ items }) {
  const [active, setActive] = useState(0);
  const current = items[Math.min(active, items.length - 1)];
  if (!current) return null;
  const [name, sub] = splitTitle(current.title);
  const link = current.url && (current.display_url || current.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));

  return (
    <div className="sec-body pick">
      <ol className="pick-list">
        {items.map((p, i) => {
          const [n, s] = splitTitle(p.title);
          const story = p.slug && p.published !== false ? `/projects/${p.slug}` : null;
          const inner = (
            <>
              {p.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={strip(p.cover_image_url)} alt="" className="pick-photo" loading={i < 4 ? 'eager' : 'lazy'} />
              ) : (
                <span className="pick-photo pick-photo-blank" />
              )}
              <span className="pick-shade" />
              <span className="pick-text">
                <span className="pick-name"><span className="pick-no">{no(i)}</span>{n}</span>
                {s && <span className="pick-sub">{s}</span>}
              </span>
              {story && <span className="pick-go" aria-hidden="true"><ChevronRight size={14} /></span>}
            </>
          );
          const props = {
            className: 'pick-strip',
            'data-active': i === active ? '' : undefined,
            onMouseEnter: () => setActive(i),
            onFocus: () => setActive(i),
          };
          return (
            <li key={p.id}>
              {story ? <Link href={story} {...props}>{inner}</Link> : <div tabIndex={0} {...props}>{inner}</div>}
            </li>
          );
        })}
      </ol>

      <article className="pick-card" aria-live="polite">
        <div className="pick-card-photo">
          {current.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={current.id} src={small(current.cover_image_url)} alt={`${name}, preview`} className="pick-fade" />
          )}
          <Glass className="pick-badge">No. {no(items.indexOf(current))}</Glass>
        </div>
        <div className="pick-card-body">
          <p className="eyebrow">Project no. {no(items.indexOf(current))}{link ? ` · ${link}` : ' · Private'}</p>
          <h3 className="text-[22px] leading-tight font-semibold tracking-tight mt-1.5">{name}</h3>
          {sub && <p className="text-sm text-zinc-500 mt-1">{sub}</p>}
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mt-3">{current.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5">
            {current.slug && current.published !== false && (
              <GlassLink href={`/projects/${current.slug}`} variant="filled" icon={<ArrowRight size={15} />}>
                Read the story
              </GlassLink>
            )}
            {current.url ? (
              <a href={current.url} target="_blank" rel="noreferrer" className="link-action inline-flex items-center gap-1 font-mono text-xs">
                {link} <ExternalLink size={11} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-zinc-500"><Lock size={11} /> Not public</span>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
