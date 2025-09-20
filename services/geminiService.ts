import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not found.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: {
            type: Type.STRING,
            description: "The name of the recipe.",
        },
        description: {
            type: Type.STRING,
            description: "A short, enticing description of the dish, including its regional or cultural origin."
        },
        prepTime: {
            type: Type.STRING,
            description: "Estimated preparation and cooking time (e.g., '45 minutes')."
        },
        difficulty: {
            type: Type.STRING,
            enum: ['Easy', 'Medium', 'Hard'],
            description: "The difficulty level of the recipe."
        },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of all ingredients required for the recipe.",
        },
        instructions: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Step-by-step instructions to prepare the dish.",
        },
        cuisineOrigin: {
            type: Type.OBJECT,
            description: "Information about the cuisine's origin.",
            properties: {
                fact: {
                    type: Type.STRING,
                    description: "A short, interesting historical or cultural fact about the cuisine of the recipe."
                },
                learnMoreLink: {
                    type: Type.STRING,
                    description: "A valid URL to a reputable source (like Wikipedia or a well-known food blog) to learn more about the cuisine."
                }
            },
            required: ["fact", "learnMoreLink"]
        }
    },
    required: ["recipeName", "description", "prepTime", "difficulty", "ingredients", "instructions", "cuisineOrigin"],
};

export const generateRecipes = async (ingredients: string[], cuisine: string): Promise<Recipe[]> => {
    const basePrompt = cuisine === 'Global'
      ? `You are a world-class chef and food historian specializing in global and regional cuisines. 
         Based on the following ingredients, generate 3 diverse and delicious recipes from different parts of the world.
         For each recipe:
         - Briefly mention its origin or the cuisine it belongs to in the description.
         - Provide a short, interesting historical or cultural fact about the cuisine.
         - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about the cuisine.`
      : `You are a world-class chef and food historian specializing in authentic ${cuisine} cuisine. 
         Based on the following ingredients, generate 3 delicious ${cuisine} recipes.
         For each recipe:
         - Briefly mention its significance or origin within ${cuisine} culture in the description.
         - Provide a short, interesting historical or cultural fact about ${cuisine} cuisine.
         - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about ${cuisine} cuisine.`;
    
    const prompt = `
        ${basePrompt}
        The user has these ingredients available: ${ingredients.join(', ')}.
        The recipes can include other common pantry staples.
        Prioritize using the provided ingredients creatively.
        Ensure the output is a valid JSON array of recipe objects that adheres to the provided schema.
    `;

    try {
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
        const recipes = JSON.parse(jsonText) as Recipe[];
        return recipes;
    } catch (error) {
        console.error("Error generating recipes:", error);
        throw new Error("Failed to communicate with the Gemini API.");
    }
};