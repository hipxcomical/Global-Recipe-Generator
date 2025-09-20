import React, { useState } from 'react';

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

const cuisineOptions = [
    'Global',
    'Chettinad',
    'Goan',
    'Hyderabadi',
    'Italian',
    'Japanese',
    'Mexican',
    'Mughlai',
    'Nepali',
    'Punjabi',
    'Telangana',
    'Thai',
];

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

  const handleAdd = () => {
    if (currentIngredient.trim()) {
      onAddIngredient(currentIngredient.trim());
      setCurrentIngredient('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/50">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="ingredient-input" className="block text-lg font-medium text-gray-700">
                Your Ingredients
            </label>
            {ingredients.length > 0 && (
                <button
                onClick={handleClearAll}
                disabled={isClearingAll || !!ingredientToRemove}
                className="text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none focus:underline disabled:text-red-300 disabled:cursor-not-allowed"
                >
                Clear All
                </button>
            )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="ingredient-input"
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., chicken breast, tomatoes"
            className="flex-grow w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
          />
          <button
            onClick={handleAdd}
            className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="mb-6 min-h-[50px] flex flex-wrap gap-2 items-center">
        {ingredients.length > 0 ? ingredients.map((ingredient) => (
          <span
            key={ingredient}
            className={`flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full animate-fade-in transition-all duration-300 ease-in-out transform ${
              (ingredientToRemove === ingredient || isClearingAll) ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
            }`}
          >
            {ingredient}
            <button
              onClick={() => handleRemove(ingredient)}
              disabled={!!ingredientToRemove || isClearingAll}
              className="ml-2 text-green-600 hover:text-green-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &times;
            </button>
          </span>
        )) : (
            <p className="text-gray-500 italic">No ingredients added yet.</p>
        )}
      </div>

      <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="cuisine-select" className="text-gray-700 font-medium">
              Cuisine Style:
            </label>
            <select
              id="cuisine-select"
              value={selectedCuisine}
              onChange={(e) => onCuisineChange(e.target.value)}
              className="px-3 py-1.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
            >
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === 'Global' ? `${cuisine} (Default)` : cuisine}
                </option>
              ))}
            </select>
          </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isLoading || ingredients.length === 0}
        className="w-full py-3 px-6 bg-orange-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? 'Generating...' : 'Generate Recipes'}
      </button>
    </div>
  );
};
