// src/config/stripe.ts

export const STRIPE_CONFIG = {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rc4m805Vs70dbkUVzqp17cknfGF9FBOYGljexXZXPFAqjEFtxKZhxJXI9zPmeu2n54ohR82MI31lFVaKQT8t2ev004Z10sJaA',

    // Stripe Elements appearance options
    appearance: {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#26687D', // Your brand color
        },
    },

    // Card element options
    cardElementOptions: {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: false,
    }
};