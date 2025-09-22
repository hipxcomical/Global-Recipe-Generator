# hipxcomical Recipe Generator

An application that generates creative global and regional recipes based on the ingredients you have on hand, powered by the Gemini API. This project is built with a modern tech stack and is optimized for deployment on Vercel.

## Features

- **AI-Powered Recipes**: Leverages the Google Gemini API to generate creative and unique recipes.
- **Ingredient-Based**: Suggests recipes based on the ingredients you currently have.
- **Cuisine Selection**: Explore a wide variety of global and regional cuisines.
- **Nutrition Information**: Get estimated calorie and protein counts for each recipe.
- **Dark Mode**: A sleek, eye-friendly dark mode that respects system preferences and can be toggled manually.
- **Responsive Design**: Fully responsive UI for a seamless experience on both desktop and mobile devices.
- **Share Recipes**: Easily share your favorite recipes with friends and family via the Web Share API or by copying to the clipboard.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Deployment**: Vercel (Frontend Hosting & Serverless Functions)
- **Analytics**: Vercel Analytics & Speed Insights

## Getting Started (Local Development)

To run this project on your local machine, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Vercel CLI](https://vercel.com/docs/cli)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/hipxcomical-recipe-generator.git
    cd hipxcomical-recipe-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add your Google Gemini API key.
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```

4.  **Run the development server:**
    Use the Vercel CLI to run the frontend and the serverless backend function together.
    ```bash
    vercel dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment

This project is optimized for deployment on Vercel.

1.  **Push to GitHub:**
    Commit your code and push it to a new GitHub repository.

2.  **Import Project on Vercel:**
    - Go to your Vercel dashboard and click "Add New... -> Project".
    - Select your GitHub repository.
    - Vercel will automatically detect that it's a Vite project and configure the build settings.

3.  **Add Environment Variable:**
    - In your new Vercel project's settings, navigate to the "Environment Variables" section.
    - Add your Gemini API key with the name `API_KEY` and the value you obtained from Google AI Studio.

4.  **Deploy:**
    - Click the "Deploy" button. Vercel will build and deploy your application. Any subsequent pushes to the `main` branch will trigger automatic deployments.
