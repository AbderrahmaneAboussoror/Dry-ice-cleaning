// src/features/home/components/about-us.tsx
import { useTranslation } from "react-i18next";

const AboutUs = () => {
    const { t } = useTranslation('home');

    const stats = [
        { number: "500+", label: t('about.stats.enginesCleaned'), color: "text-[#26687D]" },
        { number: "98%", label: t('about.stats.customerSatisfaction'), color: "text-green-600" },
        { number: "2hr", label: t('about.stats.serviceTime'), color: "text-blue-600" },
    ];

    const values = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: t('about.values.ecoFriendly.title'),
            description: t('about.values.ecoFriendly.description')
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: t('about.values.fastEfficient.title'),
            description: t('about.values.fastEfficient.description')
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: t('about.values.professional.title'),
            description: t('about.values.professional.description')
        },
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#f5faff] to-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6">
                            {t('about.hero.title')}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {t('about.hero.subtitle')}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                                    {stat.number}
                                </div>
                                <div className="text-sm md:text-base text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Our Story */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                            {t('about.story.title')}
                        </h3>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                {t('about.story.paragraph1')}
                            </p>
                            <p>
                                {t('about.story.paragraph2')}
                            </p>
                            <p>
                                {t('about.story.paragraph3')}
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-[#26687D] to-[#1a4a57] rounded-2xl p-8 text-white">
                            <div className="mb-6">
                                <svg className="w-12 h-12 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-4">{t('about.whyDryIce.title')}</h4>
                            <p className="text-cyan-100 leading-relaxed">
                                {t('about.whyDryIce.description')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                            {t('about.values.title')}
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('about.values.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-6 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#26687D] to-[#1a4a57] rounded-full flex items-center justify-center text-white">
                                    {value.icon}
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                    {value.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="text-center bg-gradient-to-r from-[#f5faff] to-[#dce8ed] rounded-2xl p-12">
                    <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                        {t('about.team.title')}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        {t('about.team.description')}
                    </p>
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#26687D] to-[#1a4a57] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                P
                            </div>
                            <h4 className="font-semibold text-gray-900">{t('about.team.paul.name')}</h4>
                            <p className="text-sm text-gray-600">{t('about.team.paul.role')}</p>
                            <p className="text-xs text-gray-500 mt-1">{t('about.team.paul.experience')}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                        <p className="text-gray-600 mb-4">
                            <strong>{t('about.contact.directContact')}</strong>
                        </p>
                        <div className="flex items-center justify-center space-x-6 text-sm">
                            <a href="tel:+4591965400" className="flex items-center space-x-2 text-[#26687D] hover:text-[#1a4a57] transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+45 91 11 96 54</span>
                            </a>
                            <a href="mailto:info@glacix.dk" className="flex items-center space-x-2 text-[#26687D] hover:text-[#1a4a57] transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>support@glacix.net</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;