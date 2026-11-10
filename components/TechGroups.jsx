'use client';
import { useState } from 'react';

// The tech stack as logo tiles. On a phone one category shows at a time,
// picked from a white tab pill whose open tab is a soft fill; from 640px up
// every category is listed and the pill goes away.
export default function TechGroups({ groups }) {
  // groups: [{ cat, items: [{ id, name, logo }] }] — logos arrive already drawn.
  const [open, setOpen] = useState(0);
  const current = Math.min(open, groups.length - 1);
  return (
    <>
      {groups.length > 1 && (
        <div className="tab-pill no-scrollbar mb-3 sm:hidden" role="tablist" aria-label="Tech stack categories">
          {groups.map((g, i) => (
            <button key={g.cat} role="tab" aria-selected={i === current} onClick={() => setOpen(i)}>
              {g.cat}
            </button>
          ))}
        </div>
      )}
      <div className="sec-body space-y-5">
        {groups.map((g, i) => (
          <div key={g.cat} className={i === current ? '' : 'max-sm:hidden'}>
            <h3 className={`font-semibold text-sm mb-2.5${groups.length > 1 ? ' max-sm:hidden' : ''}`}>{g.cat}</h3>
            <ul className="tech-grid">
              {g.items.map((t) => (
                <li key={t.id} className="tech-tile">
                  <span className="tech-logo">{t.logo}</span>
                  <span className="tech-name">{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
