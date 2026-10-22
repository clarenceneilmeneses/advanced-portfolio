import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortfolioData } from "@/lib/publicData";
import { Certifications } from "@/components/sections";

export const revalidate = 60;
export const metadata = { title: "Certifications" };

export default async function Page() {
  const { certs } = await getPortfolioData();
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="link-action inline-flex items-center gap-1.5 text-sm mb-6">
        <ArrowLeft size={15} /> Back to home
      </Link>
      <Certifications items={certs} full />
    </main>
  );
}
