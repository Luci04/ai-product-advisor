import 'dotenv/config';

export default {
    expo: {
        name: "AI Product Advisor",
        slug: "ai-product-advisor",
        version: "1.0.0",
        extra: {
            geminiApiKey: process.env.GEMINI_API_KEY,
        },
    },
};
