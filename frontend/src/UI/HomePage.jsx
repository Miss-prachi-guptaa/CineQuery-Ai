import { useState } from "react";
import { Search, Sparkles, Film, Network } from "lucide-react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");

  const suggestions = [
    "Actors in Nolan movies",
    "Sci-fi movies like Interstellar",
    "Movies directed by Spielberg",
    "Actors connected to DiCaprio",
  ];

  const demoResults = [
    {
      type: "movie",
      title: "Interstellar",
      director: "Christopher Nolan",
      score: 0.96,
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    },
    {
      type: "movie",
      title: "Inception",
      director: "Christopher Nolan",
      score: 0.91,
      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const generateSummary = (results) => {
    if (!results.length) {
      setSummary("No cinematic insights found.");
      return;
    }

    // Actors
    if (results[0].actor) {
      const actorNames = results
        .slice(0, 5)
        .map((r) => r.actor)
        .join(", ");

      setSummary(
        `CineQuery AI discovered actors including ${actorNames} connected through the cinematic knowledge graph.`,
      );

      return;
    }

    // Movies
    if (results[0].movie) {
      const movieNames = results
        .slice(0, 5)
        .map((r) => r.movie)
        .join(", ");

      setSummary(
        `The AI graph engine found movies such as ${movieNames} related to your cinematic query.`,
      );

      return;
    }

    // Vector Search Movies
    if (results[0].title) {
      const movieNames = results
        .slice(0, 5)
        .map((r) => r.title)
        .join(", ");

      setSummary(
        `Semantic AI search identified movies including ${movieNames} based on similarity and contextual understanding.`,
      );

      return;
    }

    setSummary("AI explored cinematic relationships from the graph database.");
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log("data", data);

      if (data.results?.length) {
        setResults(data.results);
        generateSummary(data.results);
        console.log("results", data.results);
      } else {
        setResults(demoResults);
      }
    } catch (err) {
      console.error(err);
      setResults(demoResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Navbar */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              CineQuery <span className="text-red-500">AI</span>
            </h1>
            <p className="text-zinc-400 mt-2">
              AI-powered cinematic knowledge explorer
            </p>
          </div>

          <button className="bg-white/10 border border-white/10 hover:bg-white/20 transition px-5 py-2 rounded-xl backdrop-blur-md">
            Explore Graph
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-300 mb-6 backdrop-blur-md">
            ✨ Neo4j + Vector Search + AI
          </div>

          <h2 className="text-5xl md:text-7xl font-black leading-tight max-w-5xl mx-auto">
            Explore the
            <span className="bg-gradient-to-r from-red-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              cinematic universe
            </span>
          </h2>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Discover actors, directors, movies and hidden relationships using
            AI-powered graph intelligence.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-3 flex items-center gap-4 shadow-2xl">
            <Search className="text-zinc-500 ml-3" size={22} />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask anything about movies, actors or directors..."
              className="flex-1 bg-transparent outline-none text-lg px-4 py-4 placeholder:text-zinc-500"
            />

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-red-500 to-violet-600 hover:scale-105 transition-all px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-red-500/20"
            >
              Search
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800 transition-all px-4 py-2 rounded-full text-sm text-zinc-300"
            >
              {item}
            </button>
          ))}
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 mb-12 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-zinc-400 text-sm uppercase tracking-widest">
              AI Summary
            </span>
          </div>

          <p className="text-xl leading-relaxed text-zinc-200">
            {summary || "Search to generate AI cinematic insights."}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {(results.length ? results : demoResults)
            .slice(0, 8)
            .map((item, index) => {
              // Detect result type
              const isActor = item.actor;
              const isMovie = item.movie;
              const isDirector = item.director && !item.title;
              const isVectorMovie = item.title;

              return (
                <div
                  key={index}
                  className="
      group
      bg-gradient-to-br
      from-zinc-900
      to-black
      border border-zinc-800
      hover:border-red-500/40
      rounded-3xl
      p-6
      transition-all
      hover:-translate-y-2
    "
                >
                  {/* Actor Card */}
                  {isActor && (
                    <>
                      <div
                        className="
            relative
            h-80
            rounded-2xl
            overflow-hidden
            mb-5
          "
                      >
                        <img
                          src={
                            item.image ||
                            "https://via.placeholder.com/500x700?text=No+Image"
                          }
                          alt={item.actor}
                          className="
              w-full
              h-full
              object-cover
              group-hover:scale-110
              transition
              duration-500
            "
                        />

                        {/* Dark Overlay */}
                        <div
                          className="
              absolute inset-0
              bg-gradient-to-t
              from-black
              via-black/20
              to-transparent
            "
                        />

                        {/* Top Badge */}
                        <div
                          className="
              absolute top-4 left-4
              bg-red-500/20
              backdrop-blur-md
              border border-red-500/30
              px-3 py-1
              rounded-full
              text-sm
              text-white
              font-medium
            "
                        >
                          🎭 Actor
                        </div>

                        {/* Bottom Content */}
                        <div
                          className="
              absolute bottom-5 left-5 right-5
            "
                        >
                          <h2
                            className="
                text-3xl
                font-black
                mb-2
                text-white
              "
                          >
                            {item.actor}
                          </h2>

                          <p
                            className="
                text-zinc-300
                text-sm
              "
                          >
                            {item.knownFor || "Cinematic Artist"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Movie Card */}
                  {isMovie && (
                    <>
                      <div
                        className="
            relative
            h-80
            rounded-2xl
            overflow-hidden
            mb-5
          "
                      >
                        <img
                          src={
                            item.poster ||
                            "https://via.placeholder.com/500x700?text=No+Poster"
                          }
                          alt={item.movie}
                          className="
              w-full
              h-full
              object-cover
              group-hover:scale-110
              transition
              duration-500
            "
                        />

                        {/* Overlay */}
                        <div
                          className="
              absolute inset-0
              bg-gradient-to-t
              from-black
              via-black/20
              to-transparent
            "
                        />

                        {/* Rating */}
                        {item.rating && (
                          <div
                            className="
                absolute top-4 right-4
                bg-black/60
                backdrop-blur-md
                px-3 py-1
                rounded-full
                text-sm
                font-semibold
              "
                          >
                            ⭐ {item.rating}
                          </div>
                        )}

                        {/* Bottom Content */}
                        <div
                          className="
              absolute bottom-5 left-5 right-5
            "
                        >
                          <div
                            className="
                inline-block
                bg-red-500/20
                border border-red-500/30
                backdrop-blur-md
                px-3 py-1
                rounded-full
                text-sm
                mb-3
              "
                          >
                            🎬 Movie
                          </div>

                          <h2
                            className="
                text-3xl
                font-black
                mb-2
              "
                          >
                            {item.movie}
                          </h2>

                          <p
                            className="
                text-zinc-300
                text-sm
                line-clamp-3
              "
                          >
                            {item.overview ||
                              "Movie discovered from graph database"}
                          </p>

                          {item.year && (
                            <p
                              className="
                  text-zinc-400
                  text-sm
                  mt-2
                "
                            >
                              Released: {item.year}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Director Card */}
                  {isDirector && (
                    <>
                      <div className="text-5xl mb-4">🎥</div>

                      <h2 className="text-2xl font-bold mb-2">
                        {item.director}
                      </h2>

                      <p className="text-zinc-400">Director entity</p>
                    </>
                  )}

                  {/* Vector Search Movie */}
                  {isVectorMovie && (
                    <>
                      <div
                        className="
            relative
            h-56
            overflow-hidden
            rounded-2xl
            mb-5
          "
                      >
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop"
                          }
                          alt={item.title}
                          className="
              w-full
              h-full
              object-cover
              group-hover:scale-110
              transition
              duration-500
            "
                        />

                        <div
                          className="
              absolute inset-0
              bg-gradient-to-t
              from-black
              to-transparent
            "
                        />

                        {item.score && (
                          <div
                            className="
                absolute top-4 right-4
                bg-black/60
                px-3 py-1
                rounded-full
                text-sm
              "
                          >
                            {(item.score * 100).toFixed(0)}% Match
                          </div>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>

                      <p className="text-zinc-400 mb-4">
                        {item.director || "AI Semantic Search Result"}
                      </p>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      className="
          flex-1
          bg-white
          text-black
          py-3
          rounded-xl
          font-semibold
          hover:opacity-90
          transition
        "
                    >
                      Explore
                    </button>

                    <button
                      className="
          px-5
          bg-zinc-800
          hover:bg-zinc-700
          transition
          rounded-xl
        "
                    >
                      Graph
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Graph Section Placeholder */}
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-10 text-center">
          <div className="text-6xl mb-6">🕸️</div>

          <h3 className="text-3xl font-bold mb-4">
            Interactive Knowledge Graph
          </h3>

          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Visualize relationships between actors, directors, genres and movies
            using Neo4j graph intelligence.
          </p>

          <div className="grid md:grid-cols-4 gap-4 text-left">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
              <div className="text-red-400 text-2xl mb-2">🎭</div>
              <div className="font-semibold">Actors</div>
              <div className="text-zinc-400 text-sm mt-1">
                Explore collaborations
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
              <div className="text-violet-400 text-2xl mb-2">🎬</div>
              <div className="font-semibold">Movies</div>
              <div className="text-zinc-400 text-sm mt-1">
                Discover similar films
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
              <div className="text-blue-400 text-2xl mb-2">🧠</div>
              <div className="font-semibold">AI Search</div>
              <div className="text-zinc-400 text-sm mt-1">
                Semantic understanding
              </div>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-5">
              <div className="text-green-400 text-2xl mb-2">🕸️</div>
              <div className="font-semibold">Neo4j</div>
              <div className="text-zinc-400 text-sm mt-1">
                Relationship mapping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
