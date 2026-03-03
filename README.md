🛠 Tech Stack Rationale

React + Vite: Modern, fast frontend framework with hot-reloading and optimized build for production. Chosen for its performance and developer experience.

Express.js (Node.js): Backend server to securely handle API requests and hide API keys from the frontend.

TMDB API: Provides detailed movie information, cast, and reviews.

Google Gemini AI API: Used to generate concise AI summaries and sentiment analysis of movie reviews.

CORS: To allow secure communication between frontend and backend.

Environment Variables: Secure storage of API keys to prevent leaks.

💡 Assumptions

Users will provide valid IMDb IDs (e.g., tt0133093).

Only the top 3 reviews are analyzed to reduce AI API usage and response time.

If no reviews are available, AI summary will show "AI summary unavailable" and sentiment will be "Unavailable".

The app handles errors gracefully:

Invalid or empty IMDb ID → shows “No data found”.

API errors or AI errors → shows appropriate error in the center of the page.

Deployment assumes backend will run on Render or a similar cloud service, and frontend will point to the deployed backend URL.

⚡ Features

Fetches movie details: title, poster, genre, year, IMDb rating, director, and top cast.

AI-generated short summary of audience reviews.

AI-generated overall sentiment: Positive / Mixed / Negative.

Responsive UI with animated search bar and background collage.

Edge-case handling for empty searches, invalid IDs, or backend errors.
