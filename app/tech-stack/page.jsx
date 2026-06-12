import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortfolioData } from "@/lib/publicData";
import { TechStack } from "@/components/sections";

export const revalidate = 60;
export const metadata = { title: "Tech Stack" };

export default async function Page() {
  const { tech } = await getPortfolioData();
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6">
        <ArrowLeft size={15} /> Back to home
      </Link>
      <TechStack items={tech} full />
    </main>
  );
}
