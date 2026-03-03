import { useState } from "react";
import "./App.css";

function App() {
  const [movieId, setMovieId] = useState("");
  const [movieData, setMovieData] = useState(null);
  const [summary, setSummary] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [cast, setCast] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMovieData(null);
    setSummary("");
    setSentiment("");
    setCast([]);

    if (!movieId.trim()) {
      setError("Please enter a Movie ID.");
      return;
    }

    setLoadingPage(true);
    setSearched(true);

    try {
      // Fetch OMDB data
      const omdbRes = await fetch(
        `https://www.omdbapi.com/?i=${movieId}&apikey=393b842d`
      );
      const omdbData = await omdbRes.json();

      if (omdbData.Response === "False") {
        setError("Movie not found. Please check the IMDb ID.");
        setLoadingPage(false);
        return;
      }

      // Fetch backend AI data
      const backendRes = await fetch("https://ai-movie-insight-1.onrender.com/api/movie-extra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdbId: omdbData.imdbID }),
      });

      const backendData = await backendRes.json();

      if (!backendRes.ok) {
        setError(backendData.error || "AI data not available.");
      } else {
        setMovieData(omdbData);
        setSummary(backendData.summary || "AI summary unavailable");
        setSentiment(backendData.sentiment || "Unavailable");
        setCast(backendData.cast || []);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }

    setLoadingPage(false);
  };

  return (
    <div className={`app-container ${searched ? "searched" : ""}`}>
      {/* Background Collage */}
      <div className="background-overlay"></div>

      {/* Search Bar */}
      <div className={`search-container ${searched ? "top" : "center"}`}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Enter Movie ID (e.g. tt0133093)"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="center-feedback">
        {loadingPage && <div className="loader">Loading...</div>}

        {!loadingPage && error && (
          <p style={{ color: "red", fontSize: "1.2rem", textAlign: "center" }}>
            {error}
          </p>
        )}

        {!loadingPage && searched && !error && !movieData && (
          <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
            No data found.
          </p>
        )}
      </div>

      {/* Movie Content */}
      {!loadingPage && !error && movieData && (
        <div className="content">
          <div className="card">
            <img src={movieData.Poster} alt={movieData.Title} />
            <div>
              <h2>{movieData.Title}</h2>
              <p>{movieData.Plot}</p>
              <p>
                <strong>Year:</strong> {movieData.Year}
              </p>
              <p>
                <strong>Genre:</strong> {movieData.Genre}
              </p>
              <p>
                <strong>IMDB:</strong> {movieData.imdbRating}
              </p>
              <p>
                <strong>Director:</strong> {movieData.Director}
              </p>
              <p>
                <strong>Top Cast:</strong> {cast.length ? cast.join(", ") : "N/A"}
              </p>
              <hr />
              <p>
                <strong>AI Summary:</strong> {summary || "AI summary unavailable"}
              </p>
              <p>
                <strong>Overall Sentiment:</strong> {sentiment || "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Data Found */}
      {!loadingPage && searched && !error && !movieData && (
        <p style={{ textAlign: "center" }}>No data found.</p>
      )}
    </div>
  );
}

export default App;
