import { Schema, model, Document, Types } from 'mongoose';

export interface IPack extends Document {
    name: string;
    description: string;
    priceExcludingVAT: number;
    priceInDKK: number;
    vatRate: number;
    pointsIncluded: number;
    bonusPoints: number;
    freeServices: {
        serviceType: 'basic' | 'deluxe';
        quantity: number;
    }[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalPoints: number; // Virtual property
    totalValue: number; // Virtual property
    vatAmount: number; // Add this virtual property
}

const packSchema = new Schema<IPack>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        priceExcludingVAT: {
            type: Number,
            required: true,
            min: 0
        },
        priceInDKK: {
            type: Number,
            required: true,
            min: 0
        }, // This becomes VAT-inclusive price
        vatRate: {
            type: Number,
            default: 0.25 // 25% VAT
        },
        pointsIncluded: {
            type: Number,
            required: true,
            min: 0
        },
        bonusPoints: {
            type: Number,
            default: 0,
            min: 0
        },
        freeServices: [{
            serviceType: {
                type: String,
                enum: ['basic', 'deluxe'],
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

packSchema.set('toJSON', { virtuals: true });
packSchema.set('toObject', { virtuals: true });

// Virtual for total points
packSchema.virtual('totalPoints').get(function() {
    return this.pointsIncluded + this.bonusPoints;
});

// Virtual for total value
packSchema.virtual('totalValue').get(function() {
    let serviceValue = 0;
    this.freeServices.forEach(service => {
        const servicePrice = service.serviceType === 'basic' ? 1000 : 1400;
        serviceValue += servicePrice * service.quantity;
    });
    return this.totalPoints + serviceValue;
});

packSchema.virtual('vatAmount').get(function() {
    return this.priceInDKK - this.priceExcludingVAT;
});

export default model<IPack>('Pack', packSchema);
