

import React, { useState } from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const Tag: React.FC<{ label: string; value: string; color: 'blue' | 'purple' | 'green' }> = ({ label, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        green: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${colorClasses[color]}`}>
           <strong>{label}:</strong> {value}
        </span>
    );
};

const CuisineSpotlight: React.FC<{ origin: Recipe['cuisineOrigin'] }> = ({ origin }) => (
    <div className="mt-6 p-4 bg-orange-50/70 rounded-lg border border-orange-200">
      <h4 className="text-md font-bold text-orange-800 mb-2">Cuisine Spotlight</h4>
      <div className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-.707 10.607a1 1 0 011.414 0l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
        <p className="text-sm text-gray-700">
            <span className="font-semibold">Did you know?</span> {origin.fact}
        </p>
      </div>
      <a 
          href={origin.learnMoreLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block mt-3 text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline transition-colors"
      >
          Learn more about this cuisine &rarr;
      </a>
    </div>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const FailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  type CopyStatus = 'idle' | 'copied' | 'failed';
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleShare = async () => {
    const shareData = {
        title: `hipxcomical Recipe: ${recipe.recipeName}`,
        text: recipe.description,
        url: window.location.href,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Web Share API failed, likely due to user cancellation.', error);
        }
    } else {
        const recipeText = `
Recipe: ${recipe.recipeName}

${recipe.description}

--------------------

INGREDIENTS:
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

--------------------

INSTRUCTIONS:
${recipe.instructions.map((inst, index) => `${index + 1}. ${inst}`).join('\n')}

Shared from hipxcomical Recipe Generator!
        `.trim();

        try {
            await navigator.clipboard.writeText(recipeText);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            setCopyStatus('failed');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    }
  };
    
  const getButtonContent = () => {
    switch(copyStatus) {
        case 'copied':
            return <><CheckIcon /> Copied!</>;
        case 'failed':
            return <><FailIcon /> Failed</>;
        default:
            return <><ShareIcon /> Share</>;
    }
  };

  const getButtonClasses = () => {
    const baseClasses = "flex items-center justify-center px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
    switch(copyStatus) {
        case 'copied':
            return `${baseClasses} bg-green-100 text-green-700 focus:ring-green-400`;
        case 'failed':
            return `${baseClasses} bg-red-100 text-red-700 focus:ring-red-400`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400`;
    }
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden flex flex-col transition-transform transform hover:scale-[1.02] hover:shadow-2xl duration-300">
      <div className="p-6 flex-grow flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.recipeName}</h2>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-2">
            <Tag label="Time" value={recipe.prepTime} color="blue" />
            <Tag label="Difficulty" value={recipe.difficulty} color="purple" />
        </div>
        
        {recipe.cuisineOrigin && <CuisineSpotlight origin={recipe.cuisineOrigin} />}

        <div className="space-y-4 mt-6 flex-grow">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-1 mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-1 mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                    ))}
                </ol>
            </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <button
                onClick={handleShare}
                className={getButtonClasses()}
                aria-label={`Share ${recipe.recipeName} recipe`}
            >
                {getButtonContent()}
            </button>
        </div>
      </div>
    </div>
  );
};
