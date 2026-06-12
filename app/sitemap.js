import { getProjectSlugs } from "@/lib/publicData";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const slugs = await getProjectSlugs();
  const now = new Date();
  return [
    { url: BASE, lastModified: now, priority: 1 },
    { url: `${BASE}/tech-stack`, lastModified: now },
    { url: `${BASE}/projects`, lastModified: now },
    { url: `${BASE}/certifications`, lastModified: now },
    ...slugs.map((s) => ({ url: `${BASE}/projects/${s}`, lastModified: now })),
  ];
}
