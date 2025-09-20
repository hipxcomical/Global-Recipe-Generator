import type { Recipe } from '../types';

export const generateRecipes = async (ingredients: string[], cuisine: string): Promise<Recipe[]> => {
    const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, cuisine }),
    });

    if (!response.ok) {
        let errorData;
        try {
            // Try to parse the error response as JSON, as our API route should provide it.
            errorData = await response.json();
        } catch (e) {
            // If the response is not JSON (e.g., a Vercel error page), use the status text.
            console.error("Failed to parse error response as JSON.");
            throw new Error(response.statusText || 'An unknown server error occurred.');
        }
        // Use the error message from the API if available.
        throw new Error(errorData.error || 'An error occurred while fetching recipes.');
    }

    try {
        // Only parse JSON if the response was successful.
        return await response.json() as Recipe[];
    } catch (error) {
        console.error("Failed to parse successful response as JSON:", error);
        // This can happen if the AI returns a malformed JSON despite the schema.
        throw new Error("Received an invalid recipe format from the server.");
    }
};