import { GoogleGenAI, Type } from "@google/genai";

// Tell Vercel to run this function on the Edge Runtime for better performance and timeouts
export const runtime = 'edge';

// This function will only handle POST requests to /api/generate-recipes
export async function POST(req: Request) {
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
            kitchenTools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of essential kitchen tools required for this recipe." },
            cuisineOrigin: {
                type: Type.OBJECT,
                properties: {
                    fact: { type: Type.STRING },
                    learnMoreLink: { type: Type.STRING }
                },
                required: ["fact", "learnMoreLink"]
            },
            nutritionInfo: {
                type: Type.OBJECT,
                properties: {
                    calories: { type: Type.STRING, description: "Estimated calories per serving, e.g., '450 kcal'" },
                    protein: { type: Type.STRING, description: "Estimated protein per serving, e.g., '30g'" }
                },
                required: ["calories", "protein"]
            },
            chefsTip: { type: Type.STRING, description: "A helpful tip from a professional chef for preparing this dish." },
            creativeVariation: { type: Type.STRING, description: "A suggestion for a creative variation of this recipe, like swapping an ingredient or adding a new one." },
        },
        required: ["recipeName", "description", "prepTime", "difficulty", "ingredients", "instructions", "kitchenTools", "cuisineOrigin", "nutritionInfo", "chefsTip", "creativeVariation"],
    };

    const basePrompt = cuisine === 'Global'
      ? `You are a world-class chef and food historian specializing in global and regional cuisines. Based on the following ingredients, generate 4 diverse and delicious recipes from different parts of the world. For each recipe: - Briefly mention its origin or the cuisine it belongs to in the description. - Provide a short, interesting historical or cultural fact about the cuisine. - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about the cuisine. - Provide an estimated calorie count (e.g., "450 kcal") and protein content (e.g., "30g") per serving. - List the essential kitchen tools needed. - Include a unique "Chef's Tip" to enhance the dish. - Suggest a "Creative Variation" for the recipe.`
      : `You are a world-class chef and food historian specializing in authentic ${cuisine} cuisine. Based on the following ingredients, generate 4 delicious ${cuisine} recipes. For each recipe: - Briefly mention its significance or origin within ${cuisine} culture in the description. - Provide a short, interesting historical or cultural fact about ${cuisine} cuisine. - Provide a valid, relevant URL (e.g., a Wikipedia page or a reputable food blog) to learn more about ${cuisine} cuisine. - Provide an estimated calorie count (e.g., "450 kcal") and protein content (e.g., "30g") per serving. - List the essential kitchen tools needed. - Include a unique "Chef's Tip" to enhance the dish. - Suggest a "Creative Variation" for the recipe.`;
    
    const prompt = `
        ${basePrompt}
        The user has these ingredients available: ${ingredients.join(', ')}.
        The recipes can include other common pantry staples.
        Prioritize using the provided ingredients creatively. Be inventive and suggest dishes that offer a unique twist or are less commonly known, while still being accessible to a home cook.
        IMPORTANT: For the 'difficulty' field in each recipe object, you MUST use one of the following exact string values: 'Easy', 'Medium', or 'Hard'.
        Ensure the output is a valid JSON array of exactly 4 recipe objects that adheres to the provided schema.
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

    const jsonText = response.text;

    if (!jsonText) {
      console.error("Received empty or undefined response text from Gemini API.");
      throw new Error("The AI model returned an empty response. Please try again.");
    }
    
    let parsedRecipes;
    try {
        parsedRecipes = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini API.", { rawResponse: jsonText });
        throw new Error("The AI model returned a malformed response. Please try again.");
    }

    if (!Array.isArray(parsedRecipes)) {
      console.error("Parsed response from Gemini API is not an array.", { parsedResponse: parsedRecipes });
      throw new Error("The AI model returned an unexpected data structure. Please try again.");
    }

    return new Response(JSON.stringify(parsedRecipes), { 
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