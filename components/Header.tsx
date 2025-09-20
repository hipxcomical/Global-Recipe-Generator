import React from 'react';

const ChefHatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.69 2 6 4.69 6 8c0 1.93 0.91 3.68 2.34 4.75C6.91 13.36 6 15.08 6 17v3h12v-3c0-1.92-0.91-3.64-2.34-4.25C17.09 11.68 18 9.93 18 8c0-3.31-2.69-6-6-6zM9 8c0-1.66 1.34-3 3-3s3 1.34 3 3v1h-6V8z"/>
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="py-6 bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200/80 relative z-20">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4">
        <ChefHatIcon />
        <div className="text-center leading-tight">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            hipxcomical
          </h1>
          <p className="text-lg text-gray-600 tracking-wide font-medium">
            Recipe Generator
          </p>
        </div>
      </div>
    </header>
  );
};
