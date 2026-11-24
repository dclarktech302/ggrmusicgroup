import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import ContentSection from "@/components/content-5";
import FooterSection from "@/components/footer";
import { getShowsContent } from "@/lib/content";

export const metadata: Metadata = {
    title: "Photo Gallery",
    description: "Photos from GGR Music Group shows and events.",
};

export default async function Gallery() {
    const { featured, gallery } = await getShowsContent();

    return (
        <>
            <HeroHeader />

            <ContentSection featured={featured} gallery={gallery} />

            <FooterSection />
        </>
    );
}
