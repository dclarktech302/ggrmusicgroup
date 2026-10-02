import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import ContentSection from "@/components/content-5";
import FooterSection from "@/components/footer";
import { getShowsContent } from "@/lib/content";

export const metadata: Metadata = {
    title: "Shows",
    description: "Subscribe to GGR Music Group for exclusive alerts and updates",
};

export default async function Shows() {
    const { featured, gallery } = await getShowsContent();

    return (
        <>
            <HeroHeader />

            <ContentSection featured={featured} gallery={gallery} />

            <FooterSection />
        </>
    );
}
