import GgrHero from '@/components/home/ggr-hero';
import { HeroHeader } from '@/components/header';
import FeaturesWithImages from '@/components/features-12';
import FooterSection from '@/components/footer';
import { getOfferImages } from '@/lib/content';
import { ArrowRight, Bell, Music, Users } from 'lucide-react';

export default async function Home() {
    const offerImages = await getOfferImages();

    return (
        <>
            <HeroHeader />

            <GgrHero />

            <FeaturesWithImages images={offerImages} />

            {/* Subscribe CTA Section */}
            <section className="py-20 bg-black">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Stay in the Loop
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Get exclusive alerts, behind-the-scenes content, and be the first to know about upcoming events and artist showcases.
                        </p>

                        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-10 lg:max-w-4xl md:max-w-sm mx-auto">
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col items-center text-center">
                                <Music className="w-6 h-6 text-blue-400 mb-3" />
                                <h3 className="text-white font-semibold mb-2">Exclusive Content</h3>
                                <p className="text-gray-400 text-sm">Behind-the-scenes footage and artist interviews</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col items-center text-center">
                                <Users className="w-6 h-6 text-blue-400 mb-3" />
                                <h3 className="text-white font-semibold mb-2">Community Access</h3>
                                <p className="text-gray-400 text-sm">Join our growing music community</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col items-center text-center">
                                <Bell className="w-6 h-6 text-blue-400 mb-3" />
                                <h3 className="text-white font-semibold mb-2">First Alerts</h3>
                                <p className="text-gray-400 text-sm">Be first to know about events and releases</p>
                            </div>
                        </div>

                        <a
                            href="https://ggr.komi.io/form/b907b906-9048-4e77-95cc-212808858389"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-xl"
                        >
                            Subscribe Now
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <p className="text-gray-400 text-sm mt-4">
                            Join 500+ music lovers already subscribed
                        </p>
                    </div>
                </div>
            </section>

            <FooterSection />
        </>
    );
}
