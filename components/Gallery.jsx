"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Gallery photos are uploaded straight from a phone, so the originals run to
// several MB each. Supabase Storage can resize on request: swapping the public
// object path for the render path turns a 9 MB photo into a ~20 KB thumbnail,
// and the browser negotiates WebP on its own. URLs that aren't Supabase Storage
// (placehold.co, imgur, ...) are passed through untouched.
const OBJECT_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

const THUMB = "width=400&height=400&resize=cover&quality=70";
const FULL = "width=1600&quality=75";

function sized(url, params) {
  if (!url || !url.includes(OBJECT_PATH)) return url;
  return `${url.replace(OBJECT_PATH, RENDER_PATH)}?${params}`;
}

export default function Gallery({ items }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(null); // index of fullscreen image, or null

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir) => setOpen((i) => (i === null ? null : (i + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  // Warm the neighbours so arrow-key paging doesn't stall on a cold fetch.
  useEffect(() => {
    if (open === null || items.length < 2) return;
    for (const dir of [1, -1]) {
      const next = items[(open + dir + items.length) % items.length];
      if (next?.image_url) new Image().src = sized(next.image_url, FULL);
    }
  }, [open, items]);

  if (!items.length) return null;
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} aria-label="Scroll gallery left"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
        <ChevronLeft size={16} />
      </button>
      <div ref={ref} className="flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((g, i) => (
          <button key={g.id} onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} fullscreen`}
            className="flex-shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sized(g.image_url, THUMB)} alt={g.caption || "Gallery photo"}
              width={400} height={400} loading="lazy" decoding="async" fetchPriority="low"
              className="h-44 w-44 md:h-48 md:w-48 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800 group-hover:opacity-90 transition-opacity" />
          </button>
        ))}
      </div>
      <button onClick={() => scroll(1)} aria-label="Scroll gallery right"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
        <ChevronRight size={16} />
      </button>

      {open !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog" aria-modal="true" onClick={close}>
          <button onClick={close} aria-label="Close fullscreen preview"
            className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10">
            <X size={22} />
          </button>
          {items.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo"
              className="absolute left-3 md:left-6 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10">
              <ChevronLeft size={26} />
            </button>
          )}
          <figure className="max-w-[92vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sized(items[open].image_url, FULL)} alt={items[open].caption || "Gallery photo"}
              decoding="async"
              className="max-w-full max-h-[82vh] object-contain rounded-lg" />
            <figcaption className="text-sm text-white/70 mt-3 text-center">
              {items[open].caption}{items[open].caption ? " · " : ""}{open + 1} / {items.length}
            </figcaption>
          </figure>
          {items.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo"
              className="absolute right-3 md:right-6 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10">
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
