import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Pack, packService } from '../../../services/packService';
import { authService } from '../../../services/authService';

// Replace with your actual publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rc4m805Vs70dbkUVzqp17cknfGF9FBOYGljexXZXPFAqjEFtxKZhxJXI9zPmeu2n54ohR82MI31lFVaKQT8t2ev004Z10sJaA');

interface PaymentModalProps {
    pack: Pack;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (pointsAwarded: number) => void;
}

interface CheckoutFormProps {
    pack: Pack;
    onSuccess: (pointsAwarded: number) => void;
    onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ pack, onSuccess, onClose }) => {
    const { t } = useTranslation('home');
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                setIsLoading(true);
                const response = await packService.initiatePurchase(pack.id);
                setClientSecret(response.clientSecret);
                setPaymentIntentId(response.paymentIntentId);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('payment.errors.initializationFailed'));
            } finally {
                setIsLoading(false);
            }
        };

        initializePayment();
    }, [pack.id, t]);

    const handleSubmit = async () => {
        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError(t('payment.errors.cardElementNotFound'));
            setIsLoading(false);
            return;
        }

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${authService.getStoredUser()?.firstName} ${authService.getStoredUser()?.lastName}`,
                        email: authService.getStoredUser()?.email,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message || t('payment.errors.paymentFailed'));
                setIsLoading(false);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                if (paymentIntentId) {
                    const confirmResponse = await packService.confirmPurchase(paymentIntentId);

                    const currentUser = authService.getStoredUser();
                    if (currentUser) {
                        const updatedUser = { ...currentUser, totalPoints: confirmResponse.userNewBalance };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }

                    onSuccess(confirmResponse.pointsAwarded);
                    onClose();
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('payment.errors.confirmationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !clientSecret) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">{t('payment.initializing')}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{pack.name}</h3>
                <p className="text-sm text-gray-600">{pack.description}</p>
                <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">
                        {pack.priceInDKK} {t('pricing.currency')}
                    </span>
                    <span className="text-sm text-gray-600">
                        {pack.totalPoints} {t('payment.points')}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    {t('payment.cardDetails')}
                </label>
                <div className="p-3 border border-gray-300 rounded-md">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            <div className="flex space-x-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isLoading}
                >
                    {t('common:cancel')}
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!stripe || isLoading}
                    className="flex-1 px-4 py-2 bg-[#26687D] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#1e5a6b] disabled:opacity-50"
                >
                    {isLoading ? t('payment.processing') : t('payment.payAmount', { amount: pack.priceInDKK, currency: t('pricing.currency') })}
                </button>
            </div>
        </div>
    );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ pack, isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation('home');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{t('payment.completePurchase')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
                <Elements stripe={stripePromise}>
                    <CheckoutForm pack={pack} onSuccess={onSuccess} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentModal;