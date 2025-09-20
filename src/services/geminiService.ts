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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            // If the server sent a JSON error, parse it.
            errorData = await response.json();
            throw new Error(errorData.error || 'An unknown error occurred on the server.');
        } else {
            // If the server sent a non-JSON response (e.g., an HTML error page from Vercel), use status text.
            throw new Error(response.statusText || 'The server returned an unexpected response.');
        }
    }

    try {
        // Only parse JSON if the response was successful.
        return await response.json() as Recipe[];
    } catch (error) {
        console.error("Failed to parse successful response as JSON:", error);
        // This can happen if the AI returns a malformed JSON despite the schema.
        throw new Error("Received an invalid recipe format from the AI. Please try again.");
    }
};