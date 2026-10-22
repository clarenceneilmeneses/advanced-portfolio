"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Download, ExternalLink, FileText, X } from "lucide-react";

// One "View Resume" trigger for both resumes: opens a modal with a
// Development / Analytics toggle and an inline PDF preview, instead of
// separate buttons that jump to a new tab.
export default function ResumeButton({ profile, variant = "button" }) {
  const p = profile || {};
  const resumes = [
    { key: "dev", label: "Development", url: p.resume_dev_url },
    { key: "analytics", label: "Analytics", url: p.resume_analytics_url },
  ].filter((r) => r.url);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!resumes.length) return null;
  const current = resumes[Math.min(active, resumes.length - 1)];
  // Supabase storage serves ?download with a Content-Disposition: attachment header.
  const downloadUrl = current.url.includes("/storage/v1/object/public/")
    ? `${current.url}?download`
    : current.url;

  return (
    <>
      {variant === "row" ? (
        <button onClick={() => setOpen(true)}
          className="tile-link w-full flex items-center justify-between text-sm px-3.5 py-2.5">
          <span className="text-left">
            <span className="flex items-center gap-1.5 text-zinc-500"><FileText size={13} /> Resume</span>
            <span className="font-medium">{resumes.map((r) => r.label).join(" / ")}</span>
          </span>
          <ChevronRight size={14} />
        </button>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-outline">
          <FileText size={15} /> View Resume
        </button>
      )}

      {/* Portal to <body>: ancestors with backdrop-filter/transform (e.g. the
          header's glass panel) would otherwise trap position:fixed inside them. */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 md:p-6"
          role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[88vh] flex flex-col rounded-[1.25rem] overflow-hidden bg-zinc-100 dark:bg-zinc-950 shadow-2xl">
            {/* Header sits a shade above the PDF well — no rule between them. */}
            <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 bg-white dark:bg-zinc-900">
              {resumes.length > 1 ? (
                <div className="segmented" role="group" aria-label="Choose a resume">
                  {resumes.map((r, i) => (
                    <button key={r.key} onClick={() => setActive(i)} aria-pressed={i === active}>
                      {r.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium px-1">{current.label} Resume</span>
              )}
              <div className="flex-1" />
              {/* Download / open / close grouped in one pill. */}
              <div className="segmented">
                <a href={downloadUrl} className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Download resume" title="Download resume">
                  <Download size={16} />
                </a>
                <a href={current.url} target="_blank" rel="noreferrer"
                  className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Open resume in new tab" title="Open resume in new tab">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => setOpen(false)} aria-label="Close resume preview" title="Close resume preview"
                  className="!p-2 !text-zinc-600 dark:!text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <X size={16} />
                </button>
              </div>
            </div>
            <iframe key={current.key} src={current.url} title={`${current.label} resume`}
              className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
