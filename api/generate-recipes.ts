import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../src/types';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { ingredients, cuisine } = req.body;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set in Vercel.");
      return res.status(500).json({ error: 'The API key is not configured. Please add it to your Vercel project settings.' });
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required.' });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const recipeSchema = {
        type: Type.OBJECT,
        properties: {
            recipeName: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTime: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            cuisineOrigin: {
                type: Type.OBJECT,
                properties: {
                    fact: { type: Type.STRING },
                    learnMoreLink: { type: Type.STRING }
                },
                required: ["fact", "learnMoreLink"]
            }
        },
        required: ["recipeName", "description", "prepTime", "difficulty", "ingredients", "instructions", "cuisineOrigin"],
    };

    const basePrompt = cuisine === 'Global'
      ? `You are a world-class chef and food historian specializing in global and regional cuisines. Based on the following ingredients, generate 3 diverse and delicious recipes from different parts of the world. For each recipe: - Briefly mention its origin or the cuisine it belongs to in the description. - Provide a short, interesting historical or cultural fact about the cuisine. - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about the cuisine.`
      : `You are a world-class chef and food historian specializing in authentic ${cuisine} cuisine. Based on the following ingredients, generate 3 delicious ${cuisine} recipes. For each recipe: - Briefly mention its significance or origin within ${cuisine} culture in the description. - Provide a short, interesting historical or cultural fact about ${cuisine} cuisine. - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about ${cuisine} cuisine.`;
    
    const prompt = `
        ${basePrompt}
        The user has these ingredients available: ${ingredients.join(', ')}.
        The recipes can include other common pantry staples.
        Prioritize using the provided ingredients creatively.
        Ensure the output is a valid JSON array of recipe objects that adheres to the provided schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: recipeSchema,
            },
        },
    });

    const jsonText = response.text.trim();
    let recipes;
    try {
        recipes = JSON.parse(jsonText);
    } catch (parseError) {
        console.error('Failed to parse JSON response from Gemini:', jsonText);
        // Log the text for debugging in Vercel logs
        return res.status(500).json({ error: 'The AI returned an invalid response. Please check the server logs.' });
    }
    
    return res.status(200).json(recipes);

  } catch (error) {
    console.error("Critical error in serverless function:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return res.status(500).json({ error: errorMessage });
  }
}