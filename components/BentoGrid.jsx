'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Masonry on CSS grid: every card keeps its natural height and the columns pack
// independently, so a tall card on one side never forces empty space on the
// other. Each item spans `ceil((contentHeight + gap) / rowUnit)` fine grid rows.
const ROW_UNIT = 8; // px per implicit grid row
const GAP = 16; // 1rem — horizontal gap and the vertical space baked into spans

// useLayoutEffect on the client, no-op on the server (avoids hydration warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function BentoGrid({ items }) {
  // items: [{ i, x, w, h, node }]
  const innerRefs = useRef({});
  const [spans, setSpans] = useState({});

  // Until heights are measured (SSR + before hydration), fall back to plain
  // auto-sized grid rows: every card gets its natural height and nothing can
  // ever overlap — the editor's `h` units say nothing about real content
  // height, so using them as pixel spans rendered garbage on slow loads.
  const measured = Object.keys(spans).length > 0;

  useIsoLayoutEffect(() => {
    function measure() {
      setSpans((prev) => {
        const next = {};
        let changed = false;
        for (const it of items) {
          const el = innerRefs.current[it.i];
          if (!el) continue;
          // offsetHeight ignores CSS transforms — keeps the math right when the
          // grid renders inside the admin's scaled-down preview frame.
          const height = el.offsetHeight;
          const span = Math.max(1, Math.ceil((height + GAP) / ROW_UNIT));
          next[it.i] = span;
          if (prev[it.i] !== span) changed = true;
        }
        return changed ? next : prev;
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    for (const it of items) {
      const el = innerRefs.current[it.i];
      if (el) ro.observe(el);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items]);

  return (
    <div
      className="bento-masonry"
      style={
        measured
          ? { gridAutoRows: `${ROW_UNIT}px`, columnGap: `${GAP}px` }
          : { gridAutoRows: 'auto', columnGap: `${GAP}px`, rowGap: `${GAP}px` }
      }
    >
      {items.map((it) => (
        <div
          key={it.i}
          className="bento-cell"
          style={{
            gridColumn: `${it.x + 1} / span ${it.w}`,
            gridRowEnd: measured ? `span ${spans[it.i] || 1}` : 'auto',
          }}
        >
          <div ref={(el) => (innerRefs.current[it.i] = el)}>{it.node}</div>
        </div>
      ))}
    </div>
  );
}
