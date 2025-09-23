import React, { useState, useCallback, useEffect, useRef } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onClearAll: () => void;
  onGenerate: () => void;
  isLoading: boolean;
  selectedCuisine: string;
  onCuisineChange: (cuisine: string) => void;
}

const COMMON_INGREDIENTS = [
  'Salt', 'Pepper', 'Olive Oil', 'Garlic', 'Onion', 'Flour', 'Sugar', 'Eggs', 'Butter', 'Milk',
  'Rice', 'Pasta', 'Tomatoes', 'Potatoes', 'Chicken Breast', 'Ground Beef', 'Lettuce', 'Cheese',
  'Bread', 'Lemon', 'Lime', 'Soy Sauce', 'Ginger', 'Cilantro', 'Parsley', 'Basil', 'Oregano',
  'Thyme', 'Rosemary', 'Cumin', 'Coriander', 'Paprika', 'Chili Powder', 'Cayenne Pepper',
  'Baking Soda', 'Baking Powder', 'Vanilla Extract', 'Honey', 'Maple Syrup', 'Vinegar',
  'Mustard', 'Mayonnaise', 'Ketchup', 'Yogurt', 'Sour Cream', 'Heavy Cream', 'Carrots',
  'Celery', 'Bell Peppers', 'Mushrooms', 'Spinach', 'Broccoli', 'Avocado', 'Cucumber',
  'Zucchini', 'Eggplant', 'Cabbage', 'Cauliflower', 'Beans', 'Lentils', 'Chickpeas', 'Quinoa',
  // Indian specifics
  'Ghee', 'Turmeric', 'Garam Masala', 'Cardamom', 'Cloves', 'Cinnamon', 'Fenugreek', 'Asafoetida',
  'Paneer', 'Basmati Rice', 'Mustard Seeds', 'Tamarind', 'Coconut Milk',
  // Asian specifics
  'Sesame Oil', 'Rice Vinegar', 'Fish Sauce', 'Sriracha', 'Hoisin Sauce', 'Tofu', 'Noodles',
  'Scallions', 'Bok Choy', 'Edamame', 'Miso Paste',
  // Mexican specifics
  'Corn Tortillas', 'Black Beans', 'Jalapeño', 'Cotija Cheese', 'Salsa', 'Chipotle',
  // Italian specifics
  'Parmesan Cheese', 'Mozzarella', 'Balsamic Vinegar', 'Prosciutto', 'Arborio Rice'
].sort();


const cuisineGroups = [
  { 
    label: 'General', 
    options: ['Global'] 
  },
  { 
    label: 'Indian Subcontinent', 
    options: [
      'Assamese', 'Awadhi (Lucknowi)', 'Bengali', 'Bihari', 'East Indian', 'Goan', 
      'Gujarati', 'Himachali', 'Hyderabadi', 'Karnataka', 'Kashmiri', 'Kerala', 
      'Maharashtrian', 'Meghalayan', 'Nepalese', 'North-East Indian', 'Odia', 'Punjabi', 
      'Rajasthani', 'Sikkimese', 'Street Food (Delhi)', 'Tamil Nadu', 'Telangana and Andhra Pradesh'
    ].sort() 
  },
  {
    label: 'East & Southeast Asian',
    options: ['Asian', 'Chinese', 'Indonesian', 'Japanese', 'Korean', 'Thai', 'Vietnamese'].sort()
  },
  {
    label: 'European',
    options: ['European', 'French', 'German', 'Greek', 'Italian', 'Spanish'].sort()
  },
  {
    label: 'Americas',
    options: ['American', 'Brazilian', 'Mexican', 'Peruvian'].sort()
  },
  {
    label: 'Middle Eastern',
    options: ['Middle Eastern']
  }
];

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearAll,
  onGenerate,
  isLoading,
  selectedCuisine,
  onCuisineChange
}) => {
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredientToRemove, setIngredientToRemove] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetInput = useCallback(() => {
    setCurrentIngredient('');
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);
  
  const handleAdd = useCallback((ingredientToAdd?: string) => {
    const ingredient = (ingredientToAdd || currentIngredient).trim();
    if (ingredient) {
      onAddIngredient(ingredient);
      resetInput();
    }
  }, [currentIngredient, onAddIngredient, resetInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentIngredient(value);

    if (value.length > 0) {
      const filtered = COMMON_INGREDIENTS.filter(
        (suggestion) => 
          suggestion.toLowerCase().startsWith(value.toLowerCase()) && 
          !ingredients.includes(suggestion.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setActiveSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd(suggestions[activeSuggestionIndex]);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (ingredient: string) => {
    if (ingredientToRemove || isClearingAll) return;
    setIngredientToRemove(ingredient);
    setTimeout(() => {
      onRemoveIngredient(ingredient);
      setIngredientToRemove(null);
    }, 300); // Duration matches CSS transition
  };
  
  const handleClearAll = () => {
    if (ingredients.length === 0 || isClearingAll || ingredientToRemove) return;
    setIsClearingAll(true);
    setTimeout(() => {
      onClearAll();
      setIsClearingAll(false);
    }, 300); // Duration matches CSS transition
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700 transition-colors duration-300">
      <div className="mb-4" ref={containerRef}>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="ingredient-input" className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                Your Ingredients
            </label>
            {ingredients.length > 0 && (
                <button
                onClick={handleClearAll}
                disabled={isClearingAll || !!ingredientToRemove}
                className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:underline disabled:text-red-300 disabled:cursor-not-allowed"
                >
                Clear All
                </button>
            )}
        </div>
        <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <input
                    id="ingredient-input"
                    type="text"
                    value={currentIngredient}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., chicken breast, tomatoes"
                    className="flex-grow w-full px-4 h-12 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:placeholder-gray-400 transition-colors duration-200"
                    autoComplete="off"
                />
                <button
                    onClick={() => handleAdd()}
                    aria-label="Add ingredient"
                    className="w-full sm:w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:opacity-50"
                    disabled={!currentIngredient.trim()}
                >
                    <PlusIcon />
                </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full sm:w-[calc(100%-3.5rem)] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <li
                        key={suggestion}
                        className={`px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-200 ${
                            index === activeSuggestionIndex
                            ? 'bg-orange-100 dark:bg-orange-500/30'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleAdd(suggestion)}
                        >
                        {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
      
      <div className="mb-6 min-h-[50px] flex flex-wrap gap-2 items-center">
        {ingredients.length > 0 ? ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className={`flex items-center bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full animate-fade-in transition-all duration-300 ease-in-out transform ${
              (ingredientToRemove === ingredient || isClearingAll) ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
            }`}
          >
            {ingredient}
            <button
              onClick={() => handleRemove(ingredient)}
              disabled={!!ingredientToRemove || isClearingAll}
              className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &times;
            </button>
          </span>
        )) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No ingredients added yet.</p>
        )}
      </div>

      <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="cuisine-select" className="text-gray-700 dark:text-gray-200 font-medium">
              Cuisine Style:
            </label>
            <select
              id="cuisine-select"
              value={selectedCuisine}
              onChange={(e) => onCuisineChange(e.target.value)}
              className="px-3 py-1.5 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors duration-200"
            >
              {cuisineGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine === 'Global' ? `${cuisine} (Default)` : cuisine}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isLoading || ingredients.length === 0}
        className="w-full py-3 px-6 bg-orange-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-orange-600 disabled:bg-orange-300 dark:disabled:bg-orange-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? 'Generating...' : 'Generate Recipes'}
      </button>
    </div>
  );
};