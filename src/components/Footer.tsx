import React from 'react';

const GeminiLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ animation: 'spin 5s linear infinite' }}
  >
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
    <defs>
      <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4285F4' }} />
        <stop offset="50%" style={{ stopColor: '#9B59B6' }} />
        <stop offset="100%" style={{ stopColor: '#F4B400' }} />
      </linearGradient>
    </defs>
    <path
      d="M12 2L14.09 8.26L20.36 10.34L14.09 12.43L12 18.69L9.91 12.43L3.64 10.34L9.91 8.26L12 2Z"
      fill="url(#gemini-gradient)"
    />
  </svg>
);


export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-12 bg-gradient-to-t from-white to-gray-50/90 dark:from-gray-900 dark:to-gray-800/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
         <div className="flex items-center justify-center gap-2">
            <p>Powered by</p>
            <GeminiLogo />
            <p className="font-semibold">Gemini</p>
         </div>
         <div className="mt-2">
            <a 
                href="mailto:hipxcomical@gmail.com?subject=Feedback for Recipe Generator"
                className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-105"
                aria-label="Send feedback via email"
            >
                Send Feedback
            </a>
         </div>
      </div>
    </footer>
  );
};