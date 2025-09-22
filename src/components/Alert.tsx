import React from 'react';

interface AlertProps {
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ message }) => {
  const [title, body] = message.includes('Reason:') 
    ? message.split('Reason:') 
    : ["Oops!", message];

  return (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-500/20 dark:border-red-500 dark:text-red-300 p-4 rounded-lg shadow-md"
      role="alert"
    >
      <p className="font-bold">{title.trim()}</p>
      {body && <p>{body.trim()}</p>}
    </div>
  );
};