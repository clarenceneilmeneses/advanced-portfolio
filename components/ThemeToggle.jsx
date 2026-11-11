'use client';
import { useEffect, useState } from 'react';
import { Button } from 'glisse';
import { Sun, Moon } from './icons';

// `bare` drops the button's own edge, for when it sits inside a pill with
// other controls (the phone's top bar, itself a sheet of glass). Otherwise
// it is a round glisse glass button.
//
// The theme lives in two places on <html>: the `dark` class (Tailwind) and
// data-theme (glisse's glass). They change together, here and in layout.jsx.
export default function ThemeToggle({ bare = false }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    // The page can hold two switches (header card + phone top bar): both read
    // the <html> class, so flipping one keeps the other's icon right.
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains('dark'));
    read();
    const watch = new MutationObserver(read);
    watch.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => watch.disconnect();
  }, []);
  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    root.dataset.theme = next ? 'dark' : 'light';
    try { localStorage.theme = next ? 'dark' : 'light'; } catch {}
  }
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = dark ? <Sun size={17} /> : <Moon size={17} />;
  if (!bare) return <Button icon={icon} onClick={toggle} aria-label={label} title={label} />;
  return (
    <button onClick={toggle} aria-label={label} title={label} className="pill-icon">
      {icon}
    </button>
  );
}
