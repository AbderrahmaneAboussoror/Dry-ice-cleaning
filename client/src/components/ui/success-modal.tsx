interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    details?: Array<{ label: string; value: string }>;
    message?: string;
    confirmText?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              title,
                                                              details,
                                                              message,
                                                              confirmText = 'Great!'
                                                          }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

                    {details && details.length > 0 && (
                        <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                            {details.map((detail, index) => (
                                <div key={index} className="flex justify-between items-center py-1">
                                    <span className="font-medium text-gray-700">{detail.label}:</span>
                                    <span className="text-gray-900">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {message && (
                        <p className="text-gray-600 mb-4">{message}</p>
                    )}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#26687D] hover:bg-[#1e5a6b] border border-transparent rounded-md text-sm font-medium text-white"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};