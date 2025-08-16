interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string | React.ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
    icon?: React.ReactNode;
}

export const InfoModal: React.FC<InfoModalProps> = ({
                                                        isOpen,
                                                        onClose,
                                                        title,
                                                        content,
                                                        confirmText = 'OK',
                                                        onConfirm,
                                                        icon
                                                    }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const defaultIcon = (
        <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="text-center">
                    <div className="mb-4">
                        {icon || defaultIcon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <div className="text-gray-600 mb-6">
                        {typeof content === 'string' ? <p>{content}</p> : content}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-[#26687D] hover:bg-[#1e5a6b] border border-transparent rounded-md text-sm font-medium text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};