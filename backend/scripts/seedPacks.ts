import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Pack from '../models/Pack';

const packs = [
    {
        name: 'Basic Pack',
        description: 'Perfect for getting started with our services',
        priceExcludingVAT: 1000, // Original price
        priceInDKK: 1250, // 1000 + 25% VAT = 1250
        vatRate: 0.25,
        pointsIncluded: 1000,
        bonusPoints: 0,
        freeServices: [],
        isActive: true
    },
    {
        name: 'Standard Pack',
        description: 'Great value with bonus points included',
        priceExcludingVAT: 2800, // Original price
        priceInDKK: 3500, // 2800 + 25% VAT = 3500
        vatRate: 0.25,
        pointsIncluded: 2800,
        bonusPoints: 500,
        freeServices: [],
        isActive: true
    },
    {
        name: 'Premium Pack',
        description: 'Best value with bonus points and free engine bay cleaning',
        priceExcludingVAT: 5600, // Original price
        priceInDKK: 7000, // 5600 + 25% VAT = 7000
        vatRate: 0.25,
        pointsIncluded: 5600,
        bonusPoints: 0,
        freeServices: [
            {
                serviceType: 'basic' as const,
                quantity: 1
            }
        ],
        isActive: true
    }
];

const seedPacks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        // Clear existing packs
        await Pack.deleteMany({});

        // Insert new packs
        const createdPacks = await Pack.insertMany(packs);

        console.log('✅ Packs seeded successfully:');
        createdPacks.forEach(pack => {
            console.log(`   - ${pack.name}: ${pack.priceExcludingVAT} DKK + VAT = ${pack.priceInDKK} DKK -> ${pack.totalPoints} points`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding packs:', error);
        process.exit(1);
    }
};

seedPacks();