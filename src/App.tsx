import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { RecipeCardSkeleton } from './components/RecipeCardSkeleton';
import { Alert } from './components/Alert';
import { Footer } from './components/Footer';
import { BackToTopButton } from './components/BackToTopButton';
import { generateRecipes } from './services/geminiService';
import type { Recipe } from './types';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['onion', 'garlic', 'tomatoes']);
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
      setIngredients(prevIngredients => [...prevIngredients, ingredient.toLowerCase()]);
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
  
  const WelcomeMessage = () => {
    const exampleIngredients = ['Chicken', 'Tomatoes', 'Rice', 'Onions', 'Cheese'];
    
    return (
      <div className="text-center p-8 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Discover Your Next Favorite Dish</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Welcome to the hipxcomical Recipe Generator! Add the ingredients you have, select a cuisine style,
              and let our AI chef inspire you.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            <p className="text-gray-700 dark:text-gray-300 font-medium">Try adding:</p>
            {exampleIngredients.map(ing => (
              <button
                key={ing}
                onClick={() => addIngredient(ing)}
                className="px-4 py-1.5 bg-orange-100/80 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 font-semibold rounded-full hover:bg-orange-200/80 dark:hover:bg-orange-500/30 transition-colors transform hover:scale-105"
              >
                {ing}
              </button>
            ))}
          </div>
      </div>
    );
  };

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

          {!isLoading && !error && recipes.length === 0 && <WelcomeMessage />}
          
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            aria-live="polite"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <RecipeCardSkeleton key={index} />)
              : recipes.map((recipe, index) => <RecipeCard key={index} recipe={recipe} />)}
          </div>
        </div>
      </main>
      <Footer />
      <BackToTopButton />
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;