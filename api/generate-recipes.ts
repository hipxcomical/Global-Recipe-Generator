import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../src/types';

// Tell Vercel to run this function on the Edge Runtime
export const runtime = 'edge';

// The handler now uses the web standard Request and Response objects
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(`Method ${req.method} Not Allowed`, { status: 405, headers: { 'Allow': 'POST' } });
  }

  try {
    const { ingredients, cuisine } = await req.json();

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      return new Response(JSON.stringify({ error: 'The API key is not configured on the server.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: 'Ingredients are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
        IMPORTANT: For the 'difficulty' field in each recipe object, you MUST use one of the following exact string values: 'Easy', 'Medium', or 'Hard'.
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

    // The Gemini API response text is already a valid JSON string, so we can pass it directly.
    return new Response(response.text, { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Critical error in edge function:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
