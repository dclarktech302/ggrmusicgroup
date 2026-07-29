import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import SubscribeForm from "@/components/form";
import FooterSection from "@/components/footer";

export const metadata: Metadata = {
    title: "Subscribe",
    description: "Subscribe to GGR Music Group for exclusive alerts and updates",
};

export default async function Subscribe({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email } = await searchParams;

    return (
        <>
            <HeroHeader />

            <main className="min-h-screen pt-24">
                <SubscribeForm initialEmail={email} />
            </main>

            <FooterSection />
        </>
    );
}
