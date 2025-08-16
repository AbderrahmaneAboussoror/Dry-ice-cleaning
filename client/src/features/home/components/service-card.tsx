import {InfoModal} from "@/components/ui/info-modal";
import {useModal} from "@/hooks/useModal";

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

  const isDisabled = button.toLowerCase() === 'coming soon';

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
        disabled={disabled}
        onClick={openModal}
        className={`px-5 py-2 rounded-xl capitalize text-sm ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'text-black bg-cyan mt-5'}`}
      >
        {button}
      </button>
    </div>

        <InfoModal
            isOpen={isOpen}
            onClose={closeModal}
            title={title}
            content={description}
            confirmText={navigationButton || 'OK'}
            onConfirm={navigation ? handleConfirm : undefined}
        />
      </>
  );
};

export default ServiceCard;
