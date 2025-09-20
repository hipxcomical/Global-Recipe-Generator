import type { Recipe } from '../types';

export const generateRecipes = async (ingredients: string[], cuisine: string): Promise<Recipe[]> => {
    try {
        const response = await fetch('/api/generate-recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients, cuisine }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the API route if available, otherwise a generic one.
            throw new Error(data.error || 'An error occurred while fetching recipes.');
        }

        return data as Recipe[];

    } catch (error) {
        console.error("Error fetching recipes from API route:", error);
        // Re-throw the error so the component can catch it and display an alert.
        throw error;
    }
};
