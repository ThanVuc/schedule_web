import CTASection from "./components/cta-section";
import FeaturesSection from "./components/features-section";
import Footer from "./components/footer";
import HeroSection from "./components/hero-section";
import TestimonialsSection from "./components/testimonials-section";

export const metadata = {
    title: 'Trang Chủ | Schedulr',
    description: 'Ứng dụng lịch trình của bạn',
}

const LandingPage = () => {
    return (
        <div className="relative min-h-screen text-foreground overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <main>
                    <HeroSection />
                    <FeaturesSection />
                    <TestimonialsSection />
                    <CTASection />
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default LandingPage;
