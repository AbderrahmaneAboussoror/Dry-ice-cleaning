// src/services/packService.ts
import { apiService } from './api';

export interface Pack {
    id: string;
    name: string;
    description: string;
    priceInDKK: number;
    pointsIncluded: number;
    bonusPoints: number;
    totalPoints: number;
    freeServices: string[];
    totalValue: number;
    savings: number;
}

export interface Purchase {
    id: string;
    pack: Pack;
    amount: number;
    status: 'pending' | 'succeeded' | 'failed' | 'canceled';
    pointsAwarded: number;
    bonusPointsAwarded: number;
    serviceCreditsAwarded: string[];
    createdAt: string;
}

export interface PaymentIntentResponse {
    message: string;
    clientSecret: string;
    paymentIntentId: string;
    pack: {
        id: string;
        name: string;
        priceInDKK: number;
        totalPoints: number;
        description: string;
    };
    purchase: {
        id: string;
        status: string;
        amount: number;
    };
}

export interface ConfirmPurchaseResponse {
    message: string;
    pointsAwarded: number;
    purchase: {
        id: string;
        status: string;
        pointsAwarded: number;
        bonusPointsAwarded: number;
        serviceCreditsAwarded: string[];
    };
    userNewBalance: number;
}

class PackService {
    async getAvailablePacks(): Promise<Pack[]> {
        // Your backend returns: { packs: [...] }
        const response = await apiService.get<{ packs: Pack[] }>('/packs');
        return response.packs;
    }

    async initiatePurchase(packId: string): Promise<PaymentIntentResponse> {
        // Your backend returns the response directly: { message, clientSecret, paymentIntentId, pack, purchase }
        return apiService.post<PaymentIntentResponse>('/packs/purchase', { packId });
    }

    async confirmPurchase(paymentIntentId: string): Promise<ConfirmPurchaseResponse> {
        // Your backend returns the response directly: { message, pointsAwarded, purchase, userNewBalance }
        return apiService.post<ConfirmPurchaseResponse>('/packs/confirm', { paymentIntentId });
    }

    async getUserPurchases(): Promise<Purchase[]> {
        // Your backend returns: { purchases: [...] }
        const response = await apiService.get<{ purchases: Purchase[] }>('/packs/purchases');
        return response.purchases;
    }
}

export const packService = new PackService();