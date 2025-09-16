import CreditCard from "@/components/icons/credit-card";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { userService, type Purchase } from "@/services/userService";

const PurchasedPacks = () => {
    const { t } = useTranslation('profile');

    // Helper function to format date
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        const locale = t('purchasedPacks.dateLocale', { defaultValue: 'en-US' });
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to format currency (convert from smallest unit)
    const formatCurrency = (amount: number, currency: string = 'dkk') => {
        const value = amount / 100; // Convert from smallest currency unit (øre to DKK)
        return new Intl.NumberFormat('da-DK', {
            style: 'currency',
            currency: currency.toUpperCase(),
            minimumFractionDigits: 2
        }).format(value);
    };

    // Helper function to safely access free services
    const formatFreeServices = (freeServices: any[]) => {
        if (!freeServices || freeServices.length === 0) return null;

        // Handle case where freeServices might be strings or objects
        return freeServices.map((service: any) => {
            if (typeof service === 'string') {
                return service;
            } else if (service && typeof service === 'object' && service.serviceType && service.quantity) {
                return `${service.quantity}x ${service.serviceType}`;
            }
            return 'service';
        }).join(', ');
    };

    // Helper function to format points with pack breakdown
    const formatPoints = (pointsAwarded: number, bonusPointsAwarded: number, freeServices: any[]) => {
        const totalPoints = pointsAwarded + bonusPointsAwarded;
        let pointsText = `${totalPoints.toLocaleString()} ${t('purchasedPacks.points')}`;

        // Add bonus points indicator if any
        if (bonusPointsAwarded > 0) {
            pointsText += ` (+${bonusPointsAwarded} bonus)`;
        }

        // Add free services indicator if any
        if (freeServices && freeServices.length > 0) {
            const serviceText = formatFreeServices(freeServices);
            if (serviceText) {
                pointsText += ` + ${serviceText}`;
            }
        }

        return pointsText;
    };

    // Helper function to get status styling - always show "Completed" for user display
    const getStatusStyle = () => {
        // Since these are purchase records in the user's history,
        // we show them all as "Completed" for simplicity
        return {
            statusColor: 'text-green-700',
            bgColor: 'bg-green-200',
            displayText: t('purchasedPacks.status.completed')
        };
    };

    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPurchases();
        loadUserBalance();
    }, []);

    const loadPurchases = async () => {
        try {
            setError(null);

            const purchaseData = await userService.getPurchases();
            setPurchases(purchaseData);
        } catch (error: any) {
            console.error('Error loading purchases:', error);
            setError(error.message || t('purchasedPacks.errors.loadFailed'));
        }
    };

    const loadUserBalance = async () => {
        try {
            setIsLoading(true);

            // Try to get from cached user first
            const cachedUser = userService.getCurrentUser();
            if (cachedUser && cachedUser.totalPoints !== undefined) {
                setCurrentBalance(cachedUser.totalPoints);
            }

            // Then fetch fresh data
            const user = await userService.getProfile();
            setCurrentBalance(user.totalPoints || 0);
        } catch (error: any) {
            console.error('Error loading user balance:', error);
            // Don't set error for balance loading, just use cached data
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        await Promise.all([loadPurchases(), loadUserBalance()]);
    };

    if (isLoading) {
        return (
            <section className="bg-white p-4 md:p-6 rounded-lg space-y-4 md:space-y-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
                <div className="animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded w-40"></div>
                        </div>
                        <div className="text-right">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white p-4 md:p-6 rounded-lg space-y-4 md:space-y-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_3px_3px_rgba(0,0,0,0.1)]">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <CreditCard size="18" color="#26687D" />
                    <span className="text-base md:text-lg text-gray-800 font-semibold capitalize">
              {t('purchasedPacks.title')}
            </span>
                    <button
                        onClick={refreshData}
                        className="text-cyan hover:text-cyan-600 text-sm font-medium ml-4"
                    >
                        {t('purchasedPacks.buttons.refresh')}
                    </button>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-gray-600">{t('purchasedPacks.currentBalance')}</p>
                    <p className="text-xl md:text-2xl font-bold text-[#26687D]">
                        {currentBalance.toLocaleString()} {t('purchasedPacks.points')}
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={refreshData}
                        className="text-red-600 hover:text-red-800 underline ml-4"
                    >
                        {t('purchasedPacks.buttons.retry')}
                    </button>
                </div>
            )}

            {/* No Purchases Message */}
            {!error && purchases.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size="24" color="#9CA3AF" />
                    </div>
                    <p className="text-gray-500">{t('purchasedPacks.empty.title')}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('purchasedPacks.empty.subtitle')}</p>
                </div>
            )}

            {/* Desktop Table View */}
            {purchases.length > 0 && (
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('purchasedPacks.table.purchaseDate')}</th>
                            <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('purchasedPacks.table.package')}</th>
                            <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('purchasedPacks.table.points')}</th>
                            <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('purchasedPacks.table.amountPaid')}</th>
                            <th className="py-3 px-4 text-gray-700 font-normal text-sm">{t('purchasedPacks.table.status')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {purchases.map((purchase) => {
                            const { statusColor, bgColor, displayText } = getStatusStyle();
                            return (
                                <tr
                                    key={purchase._id}
                                    className="border-b border-gray-100 font-[500] text-sm"
                                >
                                    <td className="py-3 px-4">{formatDate(purchase.createdAt)}</td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{purchase.packId.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{purchase.packId.description}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {(purchase.pointsAwarded + purchase.bonusPointsAwarded).toLocaleString()} {t('purchasedPacks.points')}
                                            </div>
                                            {purchase.bonusPointsAwarded > 0 && (
                                                <div className="text-xs text-green-600 mt-1">
                                                    +{purchase.bonusPointsAwarded} bonus {t('purchasedPacks.points')}
                                                </div>
                                            )}
                                            {purchase.packId.freeServices && purchase.packId.freeServices.length > 0 && (
                                                <div className="text-xs text-blue-600 mt-1">
                                                    + {formatFreeServices(purchase.packId.freeServices)}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {formatCurrency(purchase.amount, purchase.currency)}
                                    </td>
                                    <td className="py-3 px-4 text-start align-middle">
                                        <p
                                            className={`inline-block font-medium ${statusColor} ${bgColor} py-2 px-5 rounded-full`}
                                        >
                                            {displayText}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile Card View */}
            {purchases.length > 0 && (
                <div className="md:hidden space-y-4">
                    {purchases.map((purchase) => {
                        const { statusColor, bgColor, displayText } = getStatusStyle();
                        return (
                            <div
                                key={purchase._id}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                            {purchase.packId.name}
                                        </h3>
                                        <p className="text-gray-600 text-xs">{formatDate(purchase.createdAt)}</p>
                                    </div>
                                    <span
                                        className={`inline-block font-medium text-xs ${statusColor} ${bgColor} py-1 px-3 rounded-full`}
                                    >
                          {displayText}
                        </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                          <span className="text-gray-500 text-xs uppercase tracking-wide">
                            {t('purchasedPacks.mobile.points')}
                          </span>
                                        <p className="font-medium text-gray-900">
                                            {formatPoints(
                                                purchase.pointsAwarded,
                                                purchase.bonusPointsAwarded,
                                                purchase.packId.freeServices
                                            )}
                                        </p>
                                    </div>
                                    <div>
                          <span className="text-gray-500 text-xs uppercase tracking-wide">
                            {t('purchasedPacks.mobile.amountPaid')}
                          </span>
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(purchase.amount, purchase.currency)}
                                        </p>
                                    </div>
                                </div>

                                {/* Enhanced pack info display */}
                                {purchase.packId.description && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500">{purchase.packId.description}</p>
                                    </div>
                                )}

                                {/* Show free services from pack definition */}
                                {purchase.packId.freeServices && purchase.packId.freeServices.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                              {t('purchasedPacks.mobile.includedServices')}
                            </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {purchase.packId.freeServices.map((service: any, index: number) => {
                                                // Handle both string and object formats safely
                                                let displayText = 'Free service';

                                                if (typeof service === 'string') {
                                                    displayText = `Free ${service} cleaning`;
                                                } else if (service && typeof service === 'object' && service.serviceType && service.quantity) {
                                                    displayText = `${service.quantity}x ${service.serviceType} cleaning`;
                                                }

                                                return (
                                                    <span
                                                        key={index}
                                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                    >
                                      {displayText}
                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Show service credits from purchase if different from pack */}
                                {purchase.serviceCreditsAwarded && purchase.serviceCreditsAwarded.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                              Credits Received
                            </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {purchase.serviceCreditsAwarded.map((credit, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                                                >
                                    {credit.quantity}x {credit.serviceType} credit
                                  </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary Stats */}
            {purchases.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
                            <p className="text-sm text-gray-600">{t('purchasedPacks.stats.totalPurchases')}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-cyan">
                                {purchases
                                    .filter(p => p.status === 'succeeded')
                                    .reduce((total, p) => total + p.pointsAwarded + p.bonusPointsAwarded, 0)
                                    .toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">{t('purchasedPacks.stats.pointsEarned')}</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {purchases.filter(p => p.status === 'succeeded').length}
                            </p>
                            <p className="text-sm text-gray-600">{t('purchasedPacks.stats.successful')}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Buy More Points Button */}
            <div className="w-full flex items-center justify-center sm:justify-end">
                <button className="bg-cyan text-black text-sm px-6 md:px-8 py-2 rounded-md w-full sm:w-auto hover:bg-cyan-600 transition-colors">
                    {t('purchasedPacks.buttons.buyMore')}
                </button>
            </div>
        </section>
    );
};

export default PurchasedPacks;