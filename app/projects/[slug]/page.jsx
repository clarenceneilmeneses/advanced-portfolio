import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getProject, getPortfolioData } from "@/lib/publicData";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  };
}

function Block({ block }) {
  if (block.kind === "heading") {
    return <h2 className="text-xl font-bold tracking-tight mt-10 mb-3">{block.text}</h2>;
  }
  if (block.kind === "image") {
    return (
      <figure className="my-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={block.image_url} alt={block.caption || ""}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800" />
        {block.caption && (
          <figcaption className="text-sm text-zinc-500 text-center mt-2">{block.caption}</figcaption>
        )}
      </figure>
    );
  }
  // default: text paragraph(s)
  return (block.text || "").split(/\n\s*\n/).filter(Boolean).map((t, i) => (
    <p key={i} className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 my-4">{t}</p>
  ));
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  if (!project || project.published === false) notFound();
  const { profile } = await getPortfolioData();
  const blocks = project.blocks || [];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
        <ArrowLeft size={15} /> {profile?.name || "Home"}
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-extrabold tracking-tight">{project.title}</h1>
        {project.description && <p className="text-zinc-500 mt-2">{project.description}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {(project.tech || "").split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm mt-4 text-blue-600 hover:underline">
            {project.display_url || project.url} <ExternalLink size={13} />
          </a>
        )}
      </header>

      {project.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.cover_image_url} alt={project.title}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 mt-8" />
      )}

      <article className="mt-6">
        {blocks.length === 0 ? (
          <p className="text-sm text-zinc-500">This story hasn&apos;t been written yet.</p>
        ) : (
          blocks.map((b, i) => <Block key={i} block={b} />)
        )}
      </article>

      <footer className="mt-12 border-t border-zinc-100 dark:border-zinc-900 pt-6">
        <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          ← All projects
        </Link>
      </footer>
    </main>
  );
}
