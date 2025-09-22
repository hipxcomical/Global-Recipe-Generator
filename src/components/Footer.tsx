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
    <footer className="w-full py-4 mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 relative z-20 transition-colors duration-300">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
         <p>Powered by</p>
         <GeminiLogo />
         <p className="font-semibold">Gemini</p>
      </div>
    </footer>
  );
};