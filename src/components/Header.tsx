import React from 'react';

const ChefHatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.69 2 6 4.69 6 8c0 1.93 0.91 3.68 2.34 4.75C6.91 13.36 6 15.08 6 17v3h12v-3c0-1.92-0.91-3.64-2.34-4.25C17.09 11.68 18 9.93 18 8c0-3.31-2.69-6-6-6zM9 8c0-1.66 1.34-3 3-3s3 1.34 3 3v1h-6V8z"/>
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="py-6 bg-gradient-to-b from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-800/95 backdrop-blur-lg shadow-md border-b border-gray-200/80 dark:border-gray-700/80 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1"></div> {/* Spacer */}
        <div className="flex items-center justify-center gap-4 flex-1">
            <ChefHatIcon />
            <div className="text-center leading-tight">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                hipxcomical
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 tracking-wide font-medium">
                Recipe Generator
            </p>
            </div>
        </div>
        <div className="flex-1 flex justify-end">
            <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </div>
      </div>
    </header>
  );
};