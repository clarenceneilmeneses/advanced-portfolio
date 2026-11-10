'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

// `bare` drops the button's own edge, for when it sits inside a pill with
// other controls (the phone's top bar).
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
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.theme = next ? 'dark' : 'light'; } catch {}
  }
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={bare ? 'pill-icon' : 'icon-pill'}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
