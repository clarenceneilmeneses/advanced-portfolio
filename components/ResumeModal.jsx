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
          className="accent-link w-full flex items-center justify-between text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2.5 hover:text-zinc-900 dark:hover:text-white">
          <span className="text-left">
            <span className="flex items-center gap-1.5 text-zinc-500"><FileText size={13} /> Resume</span>
            <span className="font-medium">{resumes.map((r) => r.label).join(" / ")}</span>
          </span>
          <ChevronRight size={14} />
        </button>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-ghost">
          <FileText size={15} /> View Resume
        </button>
      )}

      {/* Portal to <body>: ancestors with backdrop-filter/transform (e.g. the
          header's glass panel) would otherwise trap position:fixed inside them. */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 md:p-6"
          role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[88vh] flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
            <div className="flex items-center gap-2 px-3 py-2.5 md:px-4 border-b border-zinc-200 dark:border-zinc-800">
              {resumes.length > 1 ? (
                <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5">
                  {resumes.map((r, i) => (
                    <button key={r.key} onClick={() => setActive(i)}
                      className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors ${
                        i === active
                          ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                          : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium px-1">{current.label} Resume</span>
              )}
              <div className="flex-1" />
              <a href={downloadUrl} className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Download resume" title="Download">
                <Download size={17} />
              </a>
              <a href={current.url} target="_blank" rel="noreferrer"
                className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Open resume in new tab" title="Open in new tab">
                <ExternalLink size={17} />
              </a>
              <button onClick={() => setOpen(false)} aria-label="Close resume preview"
                className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={18} />
              </button>
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
