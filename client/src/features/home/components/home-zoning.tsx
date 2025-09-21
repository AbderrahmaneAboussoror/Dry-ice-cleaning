import logo from "../../../assets/croped-logo-free-bg.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HomeZoning = () => {
    const { t } = useTranslation('home');
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Note: Testimonials could also be moved to translation files
    // but keeping them here for now since they contain real customer data
    const testimonials = [
        {
            name: "Mike Johnson",
            location: "Copenhagen",
            text: t('zoning.testimonials.mike'),
            rating: 5
        },
        {
            name: "Sarah Chen",
            location: "Aarhus",
            text: t('zoning.testimonials.sarah'),
            rating: 5
        },
        {
            name: "Lars Nielsen",
            location: "Odense",
            text: t('zoning.testimonials.lars'),
            rating: 5
        }
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleBookNow = () => {
        // Scroll to appointment section
        const appointmentSection = document.getElementById('appointment');
        if (appointmentSection) {
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="border border-gray-300 w-[95vw] max-w-[900px] bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
                <div className="h-10 md:h-14">
                    <img className="w-full h-full object-contain" src={logo} alt="GlaciX Logo" />
                </div>
                <button
                    onClick={handleBookNow}
                    className="bg-cyan hover:bg-sky-300 text-gray-800 px-6 md:px-8 py-2 rounded-xl transition-colors text-sm md:text-base whitespace-nowrap"
                >
                    {t('zoning.bookNow')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="col-span-1 lg:col-span-3 space-y-4 md:space-y-6">

                    {/* Hero Content Area */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-6 min-h-[200px] md:min-h-[240px] flex flex-col justify-center">
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                                <span className="text-xs md:text-sm font-medium text-green-700">{t('zoning.hero.mobileService')}</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                {t('zoning.hero.title')}
                            </h2>

                            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                {t('zoning.hero.description')}
                            </p>

                            <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-4 md:space-x-6 pt-2">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs md:text-sm text-gray-700">{t('zoning.hero.chemicalFree')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs md:text-sm text-gray-700">{t('zoning.hero.safeFast')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us / Benefits */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 md:p-6 min-h-[200px] md:min-h-[240px]">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">{t('zoning.whyChoose.title')}</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-2 md:space-x-3">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-gray-800 text-xs md:text-sm">{t('zoning.whyChoose.environmentallySafe.title')}</h4>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t('zoning.whyChoose.environmentallySafe.description')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 md:space-x-3">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-gray-800 text-xs md:text-sm">{t('zoning.whyChoose.timeEfficient.title')}</h4>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t('zoning.whyChoose.timeEfficient.description')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-2 md:space-x-3">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-gray-800 text-xs md:text-sm">{t('zoning.whyChoose.deepClean.title')}</h4>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t('zoning.whyChoose.deepClean.description')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 md:space-x-3">
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-gray-800 text-xs md:text-sm">{t('zoning.whyChoose.noDamage.title')}</h4>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{t('zoning.whyChoose.noDamage.description')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Customer Testimonials & Quick Stats */}
                <div className="col-span-1 order-first lg:order-last">
                    <div className="bg-gradient-to-b from-cyan-50 to-blue-50 rounded-xl p-3 md:p-4 flex flex-col h-full min-h-[300px] lg:min-h-[500px]">

                        {/* Quick Stats */}
                        <div className="mb-4 md:mb-6">
                            <h3 className="font-bold text-gray-800 text-xs md:text-sm mb-2 md:mb-3">{t('zoning.stats.title')}</h3>
                            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
                                <div className="text-center">
                                    <div className="text-lg md:text-2xl font-bold text-cyan-600">500+</div>
                                    <div className="text-xs text-gray-600 leading-tight">{t('zoning.stats.enginesCleaned')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg md:text-2xl font-bold text-cyan-600">98%</div>
                                    <div className="text-xs text-gray-600 leading-tight">{t('zoning.stats.satisfaction')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg md:text-2xl font-bold text-cyan-600">2hr</div>
                                    <div className="text-xs text-gray-600 leading-tight">{t('zoning.stats.serviceTime')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Testimonial */}
                        <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm flex-1 min-h-[150px]">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 text-xs md:text-sm">{t('zoning.testimonials.title')}</h4>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={prevTestimonial}
                                        className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs transition-colors"
                                        aria-label={t('common:previous')}
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs transition-colors"
                                        aria-label={t('common:next')}
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                <div className="flex text-yellow-400 text-xs md:text-sm">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>

                                <p className="text-gray-700 text-xs md:text-sm italic leading-relaxed">
                                    "{testimonials[currentTestimonial].text}"
                                </p>

                                <div className="text-xs text-gray-600">
                                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                                    <div>{testimonials[currentTestimonial].location}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-3 md:mt-4 text-center">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div>📞 +45 91 11 96 54</div>
                                <div>📧 support@glacix.net</div>
                                <div className="text-green-600 font-medium">{t('zoning.contact.available')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeZoning;