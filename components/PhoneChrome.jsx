'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, Glass, TabBar } from 'glisse';
import {
  Award, BriefcaseFill, Calendar, ChevronRight, EllipsisCircleFill, Github, HomeFill, Image as ImageIcon,
  Instagram, Layers, Link as LinkIcon, Linkedin, Mail, MapFill, Phone, UserRound, X,
} from './icons';
import ThemeToggle from './ThemeToggle';
import ResumeButton from './ResumeModal';

// The floating chrome, in the Malaya phone language:
//   top    — phone only: who you're reading on the left (fades in as the
//            header card scrolls away), the quick controls in a pill on the right
//   bottom — every screen: a floating bar of tabs (icon over a short label)
//            with the main step as a round button beside it, centred
//   More   — a sheet of grouped rows for everything the bar has no room for
//            (a bottom sheet on a phone, a centred card from 640px up)
//
// The floating pieces are Liquid Glass (glisse, github.com/0kzh/glisse,
// pinned to 0.5.0): the page scrolls under them, so there is something to
// bend. Chromium refracts the backdrop; Safari and iPhones get glisse's
// frosted fallback. glisse reads light/dark from <html data-theme>, which
// the theme switch keeps in step with the `dark` class.

// Which tab a section belongs to. Anything unlisted lights "More".
const TAB_OF = { header: 'home', highlights: 'home', about: 'home', stats: 'home', projects: 'work', experience: 'journey' };

const SOCIAL_ICONS = { linkedin: Linkedin, github: Github, instagram: Instagram };

// glisse's tabs are a fixed width; ours share what the dock leaves beside the
// round button: 12px gutters, an 8px gap, the 60px button and the bar's 8px
// of padding. Between 60px (a 320px phone) and 84px.
const tabWidth = (n, withFab) =>
  Math.max(60, Math.min(84, Math.floor((window.innerWidth - 24 - 8 - (withFab ? 68 : 0)) / n)));

function go(id) {
  if (id === 'header') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PhoneChrome({ profile, socials = [], sections = [] }) {
  const p = profile || {};
  const barRef = useRef(null);
  const [tab, setTab] = useState('home');
  const [more, setMore] = useState(false);
  const [tabW, setTabW] = useState(72);
  const has = (k) => sections.includes(k);

  // One scroll reader for both bars. The top bar's name follows the scroll
  // itself (--fold runs 0 → 1 as the header card leaves), it is not a timed fade.
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const fold = Math.min(1, Math.max(0, (window.scrollY - 72) / 72));
      barRef.current?.style.setProperty('--fold', fold.toFixed(3));
      // The open tab is the section whose top most recently crossed the upper
      // part of the screen, whatever order the layout editor put them in.
      const line = window.innerHeight * 0.35;
      let best = 'header';
      let bestTop = -Infinity;
      for (const key of sections) {
        const el = document.getElementById(key);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > bestTop) { best = key; bestTop = top; }
      }
      // At the very end of the page the last section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && sections.length) {
        best = sections[sections.length - 1];
      }
      setTab(TAB_OF[best] || 'more');
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  useEffect(() => {
    // Closed, the sheet hands the bar back to the scroll: re-read where we are.
    if (!more) { window.dispatchEvent(new Event('scroll')); return; }
    const onKey = (e) => e.key === 'Escape' && setMore(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [more]);

  const jump = (id) => { setMore(false); go(id); };
  const firstName = (p.name || '').split(' ')[0];
  const lastName = (p.name || '').split(' ').slice(-1)[0];
  const shortName = firstName && lastName && firstName !== lastName ? `${firstName} ${lastName}` : p.name;

  const tabs = [
    { key: 'home', label: 'Home', icon: HomeFill, onClick: () => go('header') },
    has('projects') && { key: 'work', label: 'Work', icon: BriefcaseFill, onClick: () => go('projects') },
    has('experience') && { key: 'journey', label: 'Journey', icon: MapFill, onClick: () => go('experience') },
    // The sheet waits for the bar's press lens to settle: covered mid-spring,
    // the glass stalls the page's frames (seen in Chromium).
    { key: 'more', label: 'More', icon: EllipsisCircleFill, onClick: () => setTimeout(() => setMore(true), 320) },
  ].filter(Boolean);

  const sectionRows = [
    has('about') && { id: 'about', label: 'About', hint: 'Who I am and what I build', icon: UserRound },
    has('tech_stack') && { id: 'tech_stack', label: 'Tech stack', hint: 'The tools I work in', icon: Layers },
    has('certifications') && { id: 'certifications', label: 'Certifications', hint: 'Credentials', icon: Award },
    has('gallery') && { id: 'gallery', label: 'Gallery', hint: 'Off the clock', icon: ImageIcon },
    has('footer') && { id: 'footer', label: 'Contact', hint: 'Email, socials, resume', icon: Phone },
  ].filter(Boolean);

  const cta = p.calendly_url
    ? { href: p.calendly_url, label: 'Schedule a call', icon: Calendar, external: true }
    : p.email ? { href: `mailto:${p.email}`, label: 'Send an email', icon: Mail, external: false } : null;

  useEffect(() => {
    const fit = () => setTabW(tabWidth(tabs.length, !!cta));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [tabs.length, !!cta]); // eslint-disable-line react-hooks/exhaustive-deps

  // A tab's step. glisse calls this on every tap (the open tab too) and at
  // the end of a drag; the bar's own setActive never calls back.
  const pick = (key) => {
    const t = tabs.find((x) => x.key === key);
    if (!t) return;
    setTab(key);
    t.onClick();
  };

  return (
    <div className="glass-chrome">
      {/* ── Top bar (phone) ── */}
      <div className="sm:hidden">
      <div ref={barRef} className="phone-top" style={{ '--fold': 0 }}>
        <button onClick={() => go('header')} className="phone-top-id" aria-label="Back to the top">
          {p.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 grid place-items-center text-xs font-semibold">
              {(p.name || '?')[0]}
            </span>
          )}
          <span className="text-sm font-semibold truncate">{shortName}</span>
        </button>
        <Glass className="glass-top">
          <ResumeButton profile={p} variant="icon" />
          <ThemeToggle bare />
        </Glass>
      </div>
      </div>

      {/* ── Bottom bar + the main step ── */}
      <nav className="phone-dock glass-dock" aria-label="Sections"
        style={{ '--dock-tab': `${tabW}px` }}>
        <div className="glass-tabs">
          <TabBar
            aria-label="Sections"
            value={tab}
            onValueChange={pick}
            items={tabs.map((t) => ({
              value: t.key,
              label: t.label,
              icon: <t.icon />,
            }))}
          />
        </div>
        {cta && (
          <Glass className="glass-fab">
            <a href={cta.href} target={cta.external ? '_blank' : undefined} rel={cta.external ? 'noreferrer' : undefined}
              aria-label={cta.label} title={cta.label}>
              <cta.icon size={24} />
            </a>
          </Glass>
        )}
      </nav>

      {/* ── More ── */}
      {more && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 bg-black/45" role="dialog" aria-modal="true"
          aria-label="More" onClick={() => setMore(false)}>
          <div className="phone-sheet no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-1 mb-3">
              <div>
                <p className="eyebrow mb-0.5">Menu</p>
                <p className="text-[22px] leading-tight font-semibold tracking-tight">More</p>
              </div>
              <Button icon={<X />} onClick={() => setMore(false)} aria-label="Close" />
            </div>

            {sectionRows.length > 0 && (
              <>
                <p className="eyebrow px-1 mb-2">On this page</p>
                <div className="card p-1.5 mb-4">
                  {sectionRows.map((r) => (
                    <button key={r.id} onClick={() => jump(r.id)} className="menu-row">
                      <span className="menu-icon"><r.icon size={17} strokeWidth={1.9} /></span>
                      <span className="flex-1 min-w-0 text-left">
                        <span className="block text-[15px] font-medium leading-tight">{r.label}</span>
                        <span className="block text-[13px] text-zinc-500 leading-snug">{r.hint}</span>
                      </span>
                      <ChevronRight size={16} className="text-zinc-400" />
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="eyebrow px-1 mb-2">Get in touch</p>
            <div className="card p-1.5">
              {p.calendly_url && (
                <a href={p.calendly_url} target="_blank" rel="noreferrer" className="menu-row">
                  <span className="menu-icon"><Calendar size={17} strokeWidth={1.9} /></span>
                  <span className="flex-1 text-[15px] font-medium">Schedule a call</span>
                  <ChevronRight size={16} className="text-zinc-400" />
                </a>
              )}
              {p.email && (
                <a href={`mailto:${p.email}`} className="menu-row">
                  <span className="menu-icon"><Mail size={17} strokeWidth={1.9} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium leading-tight">Send an email</span>
                    <span className="block text-[13px] text-zinc-500 leading-snug truncate">{p.email}</span>
                  </span>
                  <ChevronRight size={16} className="text-zinc-400" />
                </a>
              )}
              {socials.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform?.toLowerCase()] || LinkIcon;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="menu-row">
                    <span className="menu-icon"><Icon size={17} strokeWidth={1.9} /></span>
                    <span className="flex-1 text-[15px] font-medium">{s.platform}</span>
                    <ChevronRight size={16} className="text-zinc-400" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
