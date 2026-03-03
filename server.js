import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const TMDB_API_KEY = "0d93e4005ff94bed2e46368535b7bb0a";

// 🔹 Initialize Gemini AI
// Replace with your working API key
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDtaI0fQPnOJz4iSWqWoG1EhcyRthZWpwo"
});

app.post("/api/movie-extra", async (req, res) => {
  try {
    const { imdbId } = req.body;

    // 1️⃣ IMDb → TMDB
    const findRes = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    const findData = await findRes.json();
    const tmdbId = findData.movie_results[0]?.id;
    if (!tmdbId) return res.json({ summary: "", sentiment: "", cast: [] });

    // 2️⃣ Get Reviews
    const reviewRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/reviews?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const reviewData = await reviewRes.json();
    const reviews = reviewData.results?.map(r => r.content).slice(0, 3) || [];

    let summary = "AI summary unavailable";
    let sentiment = "Unavailable";

    if (reviews.length > 0) {
      const combinedReviews = reviews.join("\n\n");

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `
Summarize these movie reviews in 3 lines.
Then clearly write:
Overall Sentiment: Positive / Mixed / Negative

${combinedReviews}
          `
        });

        summary = response.text;

        // Extract sentiment manually
        if (summary.includes("Positive")) sentiment = "Positive";
        else if (summary.includes("Negative")) sentiment = "Negative";
        else sentiment = "Mixed";

      } catch (err) {
        console.log("Gemini API error:", err.message);
      }
    }

    // 3️⃣ Top 10 Cast
    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const creditsData = await creditsRes.json();
    const topCast = creditsData.cast?.slice(0, 10).map(a => a.name) || [];

    res.json({ summary, sentiment, cast: topCast });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));