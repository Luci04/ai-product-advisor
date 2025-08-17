import React, { useState, createContext, useContext } from "react";
import PRODUCT_CATALOG from "../constants/skus.json";
import Constants from "expo-constants";

const GEMINI_API_KEY = Constants.expoConfig.extra.geminiApiKey;

// ---------------------
// ProductContext provides the catalog and an `askAI` method to do recommendations
const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [catalog] = useState(
    PRODUCT_CATALOG.map((item, index) => ({
      ...item,
      id: index,
    }))
  );

  // askAI: a function that takes the user's natural-language query and returns
  // {explanation: string, recommendations: [{product, score, reason}] }
  // In production: replace the mock implementation with a call to your backend
  // that calls Gemini / OpenAI / other LLM. See the example prompt construction below.
  async function askAI(userQuery) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a product recommendation assistant.
    The user asked: "${userQuery}".
    Here is the product catalog in JSON: ${JSON.stringify(PRODUCT_CATALOG)}.
    
    Return ONLY valid JSON, no markdown, no extra text.
    Format:
    {
      "explanation": "string",
      "recommendations": [
        { "id": "productId", "score": number, "reason": "string" }
      ]
    }
    `,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      // remove markdown fences if Gemini added them
      const cleaned = rawText.replace(/```json|```/g, "").trim();

      let parsed = JSON.parse(cleaned);

      const filteredRecommendations =
        parsed?.recommendations
          .map((rec) => {
            const product = PRODUCT_CATALOG.find((p) => p.id === rec.id);
            if (!product) return null; // in case the product id doesn't exist
            return {
              product,
              score: rec.score,
              reason: rec.reason,
            };
          })
          .filter(Boolean) // remove nulls
          .sort((a, b) => b.score - a.score) || []; // descending order

      parsed.recommendations = filteredRecommendations;

      console.log("recommendations", filteredRecommendations);

      return parsed;
    } catch (err) {
      console.error("Gemini error", err);
      return { explanation: "Error calling Gemini", recommendations: [] };
    }
  }

  return (
    <ProductContext.Provider value={{ askAI }}>
      {children}
    </ProductContext.Provider>
  );
};
