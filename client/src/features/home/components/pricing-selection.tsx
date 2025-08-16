// src/features/home/components/pricing-selection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Check from "@/components/icons/check";
import PaymentModal from './payment-modal';
import { Pack, packService } from '../../../services/packService';
import { authService } from '../../../services/authService';
import paths from '@/config/paths';
import {useModal} from "@/hooks/useModal";
import {ConfirmationModal} from "@/components/ui/confirmation-modal";
import {SuccessModal} from "@/components/ui/success-modal";

interface PricingTierProps {
    pack: Pack;
    onPurchase: () => void;
    isAuthenticated: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ pack, onPurchase, isAuthenticated }) => {
    // Safely extract and calculate values
    const priceDisplay = typeof pack.priceInDKK === 'number' ? pack.priceInDKK : 0;
    const pointsIncluded = typeof pack.pointsIncluded === 'number' ? pack.pointsIncluded : 0;
    const bonusPoints = typeof pack.bonusPoints === 'number' ? pack.bonusPoints : 0;
    const totalPoints = pointsIncluded + bonusPoints;

    // Calculate savings (you can adjust this logic based on your business rules)
    const baseRate = 1; // 1 DKK per point as baseline
    const expectedPrice = totalPoints * baseRate;
    const actualSavings = expectedPrice > priceDisplay ? expectedPrice - priceDisplay : 0;

    // Format free services for display
    const formatFreeServices = (services: any[]) => {
        if (!Array.isArray(services) || services.length === 0) return [];

        return services.map(service => {
            const serviceTypeName = service.serviceType === 'basic' ? 'Basic Cleaning' : 'Deluxe Cleaning';
            const quantity = service.quantity || 1;
            return quantity > 1 ? `${quantity}x ${serviceTypeName}` : serviceTypeName;
        });
    };

    const freeServicesFormatted = formatFreeServices(pack.freeServices || []);

    return (
        <div className="rounded-2xl border p-6 hover:scale-[1.05] cursor-pointer ease-in-out transition-all bg-gray-100 border-gray-400">
            <h3 className="text-lg font-semibold text-gray-900">
                {pack.name || 'Pack'}
            </h3>

            <div className="mt-4 text-4xl font-bold text-gray-900">
                {priceDisplay} DKK{" "}
                <span className="text-2xl font-semibold text-gray-700">
                    for {totalPoints} points
                </span>
            </div>

            <p className="mt-2 text-xs text-gray-600">
                {pack.description || 'No description available'}
            </p>

            {actualSavings > 0 && (
                <div className="mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Save {actualSavings} DKK
                </div>
            )}

            <button
                onClick={onPurchase}
                className="mt-6 capitalize w-full rounded-full py-2 text-sm font-medium transition text-gray-800 hover:bg-gray-100 border border-gray-300"
            >
                {isAuthenticated ? 'Purchase Pack' : 'Login to Purchase'}
            </button>

            <div className="mt-6 border-t border-gray-400 pt-6">
                <ul className="space-y-2">
                    {/* Always show points included */}
                    <li className="flex items-center justify-start gap-2">
                        <Check color="black" />
                        <span className="text-xs text-gray-700">
                            {pointsIncluded} points included
                        </span>
                    </li>

                    {/* Show bonus points if any */}
                    {bonusPoints > 0 && (
                        <li className="flex items-center justify-start gap-2">
                            <Check color="black" />
                            <span className="text-xs text-gray-700">
                                {bonusPoints} bonus points
                            </span>
                        </li>
                    )}

                    {/* Show free services if any */}
                    {freeServicesFormatted.length > 0 && freeServicesFormatted.map((service, index) => (
                        <li key={index} className="flex items-center justify-start gap-2">
                            <Check color="black" />
                            <span className="text-xs text-gray-700">
                                Free {service}
                            </span>
                        </li>
                    ))}

                    {/* Standard features that apply to all packs */}
                    <li className="flex items-center justify-start gap-2">
                        <Check color="black" />
                        <span className="text-xs text-gray-700">
                            No Expiry
                        </span>
                    </li>
                    <li className="flex items-center justify-start gap-2">
                        <Check color="black" />
                        <span className="text-xs text-gray-700">
                            Instant Access
                        </span>
                    </li>
                    <li className="flex items-center justify-start gap-2">
                        <Check color="black" />
                        <span className="text-xs text-gray-700">
                            Priority Support
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const PricingSelection: React.FC = () => {
    const authModal = useModal();
    const successModal = useModal();
    const navigate = useNavigate();
    const [packs, setPacks] = useState<Pack[]>([]);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [successPoints, setSuccessPoints] = useState<number>(0);

    useEffect(() => {
        // Check authentication status when component mounts
        setIsAuthenticated(authService.isAuthenticated());

        const fetchPacks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const packsData = await packService.getAvailablePacks();

                // Validate the data structure
                if (Array.isArray(packsData)) {
                    setPacks(packsData);
                } else {
                    throw new Error('Invalid packs data received');
                }
            } catch (err) {
                console.error('Failed to fetch packs:', err);
                setError(err instanceof Error ? err.message : 'Failed to load packs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPacks();
    }, []);

    // Authentication check with popup
    const checkAuthentication = async (): Promise<boolean> => {
        if (!authService.isAuthenticated()) {
            authModal.openModal();
            return false;
        }
        return true;
    };

    const handleAuthConfirm = () => {
        authModal.closeModal();
        navigate(paths.login.path);
    };

    const handlePurchase = async (pack: Pack) => {
        // First check authentication with popup
        const isAuthenticatedCheck = await checkAuthentication();
        if (!isAuthenticatedCheck) {
            return;
        }

        // If authenticated, proceed with purchase
        setSelectedPack(pack);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async (pointsAwarded: number) => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            const updatedUser = { ...currentUser };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setSuccessPoints(pointsAwarded);
        successModal.openModal();

        // Close payment modal and reset state
        setIsPaymentModalOpen(false);
        setSelectedPack(null);
    };

    const handleCloseModal = () => {
        setIsPaymentModalOpen(false);
        setSelectedPack(null);
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading packs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!Array.isArray(packs) || packs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">No packs available at the moment.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                    <PricingTier
                        key={pack.id || Math.random()}
                        pack={pack}
                        onPurchase={() => handlePurchase(pack)}
                        isAuthenticated={isAuthenticated}
                    />
                ))}

                {selectedPack && (
                    <PaymentModal
                        pack={selectedPack}
                        isOpen={isPaymentModalOpen}
                        onClose={handleCloseModal}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </div>
            <ConfirmationModal
                isOpen={authModal.isOpen}
                onClose={authModal.closeModal}
                onConfirm={handleAuthConfirm}
                title="Sign In Required"
                message="You need to sign in to purchase points. Create an account or sign in to buy point packages and start booking services."
                confirmText="Sign In"
                cancelText="Cancel"
                type="info"
                icon={
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                }
            />

            {/* Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={successModal.closeModal}
                title="Purchase Successful!"
                message={`🎉 You received ${successPoints} points! Your points have been added to your account and you can now book services.`}
            />
        </>
    );
};

export default PricingSelection;