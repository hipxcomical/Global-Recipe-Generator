import React from 'react';

export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          {/* Description */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          {/* Tags */}
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
          </div>
          <div className="flex gap-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-28"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
          </div>
          
          {/* Section Header */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 pt-4"></div>
          {/* List Items */}
          <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>

          {/* Section Header */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 pt-4"></div>
          {/* List Items */}
          <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
