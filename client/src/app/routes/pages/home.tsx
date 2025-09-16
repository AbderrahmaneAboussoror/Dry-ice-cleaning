// src/app/routes/pages/home.tsx
import { useTranslation } from "react-i18next";
import HomeZoning from "@/features/home/components/home-zoning";
import OurServices from "@/features/home/components/our-services";
import PricingSelection from "@/features/home/components/pricing-selection";
import ContactUs from "@/features/home/components/contact-us";
import BookAppointment from "@/features/home/components/book-appointment";
import BaseLayout from "@/components/layouts/base-layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import BackToTop from "@/components/ui/back-to-top";
import AboutUs from "@/features/home/components/about-us";

const Home = () => {
    const { t } = useTranslation('home');

    const scrollToAppointment = () => {
        const appointmentSection = document.getElementById('appointment');
        if (appointmentSection) {
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <BaseLayout>
            <div className="pb-10">
                <div className="bg-gradient-to-b from-[#f5faff] to-[#dce8ed] min-h-screen">
                    <div className="h-[80vh] flex flex-col gap-16 items-center justify-center">
                        <h1 className="capitalize text-center cursor-default leading-tight font-semibold text-[30px] md:text-[90px] w-4/5 max-w-[900px]">
                            {t('hero.mainTitle')}
                        </h1>
                        <div className="w-full flex items-center justify-center">
                            <button
                                className="px-8 py-2 rounded-xl capitalize text-black bg-cyan hover:bg-sky-300 transition-colors"
                                onClick={scrollToAppointment}
                            >
                                {t('hero.ctaButton')}
                            </button>
                        </div>
                    </div>
                    <div className="translate-y-36 flex items-center justify-center">
                        <HomeZoning />
                    </div>
                </div>
                <div id="services" className="pt-44 p-5 mt-52">
                    <OurServices />
                </div>
                <div id="appointment" className="mt-56">
                    <BookAppointment />
                </div>
                <div id="about-us" className="mt-56">
                    <AboutUs />
                </div>
                <div id="pricing" className="space-y-5 pt-16 mt-56">
                    <p className="capitalize text-5xl font-semibold text-center">
                        {t('pricing.sectionTitle')}
                    </p>
                    <p className="capitalize text-center">{t('pricing.sectionSubtitle')}</p>
                    <div className="w-full md:w-11/12 mx-auto p-10">
                        <ErrorBoundary>
                            <PricingSelection />
                        </ErrorBoundary>
                    </div>
                </div>
                <div id="contact" className="mt-56">
                    <ContactUs />
                </div>
            </div>

            <BackToTop />
        </BaseLayout>
    );
};

export default Home;