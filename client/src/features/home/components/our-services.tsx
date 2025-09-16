import ServiceCard from "@/features/home/components/service-card";
import { useTranslation } from "react-i18next";
import service1 from "@/assets/service-1.png";
import service2 from "@/assets/service-2.png";
import service3 from "@/assets/service-3.png";

interface ServiceCardProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc: string;
    button: string;
    imageAlt: string;
    navigation?: string;
    navigationButton?: string;
    disabled?: boolean;
}

const OurServices = () => {
    const { t } = useTranslation('home');

    const services: ServiceCardProps[] = [
        {
            title: t('services.automotive.title'),
            subtitle: t('services.automotive.subtitle'),
            description: t('services.automotive.description'),
            button: t('services.learnMore'),
            imageSrc: service1,
            imageAlt: t('services.automotive.imageAlt'),
            navigation: "#appointment",
            navigationButton: t('services.makeAppointment'),
        },
        {
            title: t('services.industrial.title'),
            subtitle: t('services.industrial.subtitle'),
            description: t('services.industrial.description'),
            button: t('services.learnMore'),
            imageSrc: service2,
            imageAlt: t('services.industrial.imageAlt'),
            navigation: "#contact",
            navigationButton: t('services.contactUs'),
        },
        {
            title: t('services.residential.title'),
            subtitle: t('services.residential.subtitle'),
            description: t('services.residential.description'),
            button: t('services.comingSoon'),
            imageSrc: service3,
            imageAlt: t('services.residential.imageAlt'),
            disabled: true
        },
    ];

    return (
        <div className="w-full space-y-5 px-5">
            <p className="text-4xl font-semibold capitalize">{t('services.title')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                {services.map((service, i) => (
                    <ServiceCard
                        key={i}
                        title={service.title}
                        subtitle={service.subtitle}
                        description={service.description}
                        imageSrc={service.imageSrc}
                        imageAlt={service.imageAlt}
                        button={service.button}
                        navigation={service.navigation}
                        navigationButton={service.navigationButton}
                        disabled={service.disabled}
                    />
                ))}
            </div>
        </div>
    );
};

export default OurServices;