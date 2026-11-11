import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
import { getPortfolioData } from "@/lib/publicData";
import { Projects } from "@/components/sections";
import { accentStyle } from "@/components/portfolioSections";

export const revalidate = 60;
export const metadata = { title: "Projects" };

export default async function Page() {
  const { projects, profile } = await getPortfolioData();
  // Same accent and wallpaper as the home page, so the cards sit on colour.
  const accent = accentStyle(profile?.accent_color);
  return (
    <main className={`wallpaper max-w-4xl mx-auto px-4 py-10${accent ? " accent-on" : ""}`} style={accent || undefined}>
      <Link href="/" className="link-action inline-flex items-center gap-1.5 text-sm mb-6">
        <ArrowLeft size={15} /> Back to home
      </Link>
      <Projects items={projects} full />
    </main>
  );
}
