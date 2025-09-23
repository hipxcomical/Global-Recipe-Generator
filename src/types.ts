
export interface CuisineOrigin {
  fact: string;
  learnMoreLink: string;
}

export interface NutritionInfo {
  calories: string;
  protein: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  kitchenTools: string[];
  cuisineOrigin: CuisineOrigin;
  nutritionInfo: NutritionInfo;
  chefsTip: string;
  creativeVariation: string;
}