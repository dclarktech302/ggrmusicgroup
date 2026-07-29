import type { Metadata } from "next";
import { HeroHeader } from "@/components/header";
import ContentSection from "@/components/content-5";
import FooterSection from "@/components/footer";

export const metadata: Metadata = {
    title: "Shows",
    description: "Subscribe to GGR Music Group for exclusive alerts and updates",
};

export default function Shows() {
    return (
        <>
            <HeroHeader />

            <ContentSection />

            <FooterSection />
        </>
    );
}
