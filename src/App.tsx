import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { Spinner } from './components/Spinner';
import { Alert } from './components/Alert';
import { Footer } from './components/Footer';
import { generateRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['flour', 'sugar', 'eggs']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Global');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await generateRecipes(ingredients, selectedCuisine);
      setRecipes(generatedRecipes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Sorry, we couldn't generate recipes. Reason: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, selectedCuisine]);
  
  const WelcomeMessage = () => (
    <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Discover Your Next Favorite Dish</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to the hipxcomical Recipe Generator! Add the ingredients you have, select a cuisine style,
            and let our AI chef inspire you with delicious recipes from around the world or a specific region.
            Let's get cooking!
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col transition-colors duration-300">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 dark:opacity-5 grayscale blur-sm" 
        style={{backgroundImage: "url('https://source.unsplash.com/1920x1080/?food,ingredients,spices,cooking,flatlay')"}}
      ></div>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={addIngredient}
            onRemoveIngredient={removeIngredient}
            onClearAll={clearAllIngredients}
            onGenerate={handleGenerateRecipes}
            isLoading={isLoading}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
          />

          {error && <Alert message={error} />}

          {isLoading && <Spinner />}

          {!isLoading && !error && recipes.length === 0 && <WelcomeMessage />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;