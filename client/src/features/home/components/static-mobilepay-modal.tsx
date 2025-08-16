// src/features/home/components/static-mobilepay-modal.tsx
import React, { useState } from 'react';
import { Pack } from '../../../services/packService';
import { authService } from '../../../services/authService';

interface StaticMobilePayModalProps {
    pack: Pack;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pointsAwarded: number) => void;
}

const StaticMobilePayModal: React.FC<StaticMobilePayModalProps> = ({
                                                                       pack,
                                                                       isOpen,
                                                                       onClose
                                                                   }) => {
    const [step, setStep] = useState<'instructions' | 'confirmation'>('instructions');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const priceDisplay = typeof pack.priceInDKK === 'number' ? pack.priceInDKK : 0;
    const pointsDisplay = typeof pack.totalPoints === 'number' ? pack.totalPoints : 0;
    const currentUser = authService.getCurrentUser();

    // Static QR code URL (replace with actual QR code from client)
    const staticQRCodeUrl = "/path/to/static/mobilepay-qr-code.png"; // Replace with actual path

    const handlePaymentConfirmation = async () => {
        setIsSubmitting(true);

        try {
            // Submit payment notification to backend for manual verification
            const response = await fetch('/api/payment-notifications/notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getStoredToken()}`
                },
                body: JSON.stringify({
                    packId: pack.id,
                    amount: priceDisplay,
                    currency: 'DKK'
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message but explain manual verification
                setStep('confirmation');
            } else {
                // Handle specific error cases
                if (response.status === 409) {
                    alert('You have already submitted a payment notification for this pack recently. Please wait for processing.');
                } else {
                    throw new Error(data.error || 'Failed to submit payment notification');
                }
            }
        } catch (error) {
            console.error('Error submitting payment notification:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Please contact support.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">MobilePay Payment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'instructions' && (
                        <>
                            {/* Pack Summary */}
                            <div className="text-center mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">{pack.name}</h3>
                                <div className="text-3xl font-bold text-[#26687D] mb-1">{priceDisplay} DKK</div>
                                <div className="text-gray-600">{pointsDisplay} points</div>
                            </div>

                            {/* QR Code */}
                            <div className="flex justify-center mb-6">
                                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden">
                                    {/* Replace this with actual QR code image */}
                                    <img
                                        src={staticQRCodeUrl}
                                        alt="MobilePay QR Code"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            // Fallback if image doesn't load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center">
                            <div class="w-32 h-32 bg-black rounded-lg flex items-center justify-center mb-2 mx-auto">
                              <svg class="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 2h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-2h2v2h-2v-2z"/>
                              </svg>
                            </div>
                            <p class="text-xs text-gray-500">MobilePay QR Code</p>
                          </div>
                        </div>
                      `;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-amber-800 text-sm mb-1">Important</h4>
                                        <p className="text-amber-700 text-sm">
                                            Please enter <strong>exactly {priceDisplay} DKK</strong> when paying.
                                            Include your name in the payment comment for faster processing.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Payment Steps:</h4>
                                <ol className="text-sm text-gray-600 space-y-3">
                                    <li className="flex items-start">
                                        <span className="bg-[#26687D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                                        <div>
                                            <strong>Open MobilePay app</strong> and scan the QR code above
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-[#26687D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                                        <div>
                                            <strong>Enter amount:</strong> {priceDisplay} DKK
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-[#26687D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                                        <div>
                                            <strong>Add comment:</strong> "{currentUser?.firstName} {currentUser?.lastName} - {pack.name}"
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-[#26687D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                                        <div>
                                            <strong>Complete payment</strong> in your MobilePay app
                                        </div>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="bg-[#26687D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">5</span>
                                        <div>
                                            <strong>Click "I've Paid"</strong> below to notify us
                                        </div>
                                    </li>
                                </ol>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handlePaymentConfirmation}
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                                    isSubmitting
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-[#26687D] text-white hover:bg-[#1e5a6b]'
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Notifying...
                                    </div>
                                ) : (
                                    "I've Completed the Payment"
                                )}
                            </button>
                        </>
                    )}

                    {step === 'confirmation' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Notification Sent!</h3>
                            <p className="text-gray-600 mb-4">
                                We've received your payment notification. Our team will verify your payment and add your {pointsDisplay} points within 1-2 business hours.
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                You'll receive an email confirmation once your points are added to your account.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-[#26687D] text-white px-6 py-2 rounded-lg hover:bg-[#1e5a6b] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'instructions' && (
                    <div className="p-4 bg-gray-50 rounded-b-2xl">
                        <div className="text-xs text-gray-500 text-center">
                            <p className="mb-1">💡 <strong>Tip:</strong> Save this page if you need to reference the payment details</p>
                            <p>Questions? Contact us at support@glacix.dk</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaticMobilePayModal;