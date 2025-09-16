import {InfoModal} from "@/components/ui/info-modal";
import {useModal} from "@/hooks/useModal";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    button: string;
    navigation?: string;
    navigationButton?: string;
    disabled?: boolean;
}

const ServiceCard = ({
                         title,
                         subtitle,
                         description,
                         imageSrc,
                         imageAlt,
                         button,
                         navigation,
                         navigationButton,
                         disabled = false
                     }: ServiceCardProps) => {
    const { t } = useTranslation('common');
    const { isOpen, openModal, closeModal } = useModal();

    const handleConfirm = () => {
        if (navigation) {
            setTimeout(() => {
                const element = document.querySelector(navigation);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                } else {
                    console.warn(`Element with selector '${navigation}' not found`);
                }
            }, 100);
        }
    };

    // Check if button text indicates coming soon in multiple languages
    const isDisabled = disabled ||
        button.toLowerCase() === 'coming soon' ||
        button.toLowerCase() === 'kommer snart';

    return (
        <>
            <div className="w-full space-y-5 flex flex-col items-center justify-center">
                <div className="w-full overflow-hidden">
                    <img
                        className="w-full h-full object-contain rounded-xl"
                        src={imageSrc}
                        alt={imageAlt}
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="font-semibold text-base capitalize">{title}</p>
                    <p className="text-xs capitalize">{subtitle}</p>
                </div>
                <button
                    disabled={isDisabled}
                    onClick={openModal}
                    className={`px-5 py-2 rounded-xl capitalize text-sm transition-colors ${
                        isDisabled
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                            : 'text-black bg-cyan mt-5 hover:bg-sky-300'
                    }`}
                    aria-label={`${button} - ${title}`}
                >
                    {button}
                </button>
            </div>

            <InfoModal
                isOpen={isOpen}
                onClose={closeModal}
                title={title}
                content={description}
                confirmText={navigationButton || t('close')}
                onConfirm={navigation ? handleConfirm : undefined}
            />
        </>
    );
};

export default ServiceCard;