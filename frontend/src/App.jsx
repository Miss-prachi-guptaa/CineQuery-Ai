import { useState } from "react";

export default function App() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    if (!query.trim()) return;

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/query",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      setResults(data.results);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          CineQuery AI
        </h1>

        {/* Input */}
        <div className="flex gap-4 mb-8">

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Ask movie queries..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none"
          />

          <button
            onClick={handleSearch}
            className="bg-white text-black px-6 rounded-xl font-semibold"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (

          <div className="mb-6">
            Thinking...
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">

          {results?.map((item, index) => (

            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >

              {/* Graph Results */}
              {item.actor && (
                <div>
                  🎭 {item.actor}
                </div>
              )}

              {item.movie && (
                <div>
                  🎬 {item.movie}
                </div>
              )}

              {/* Vector Results */}
              {item.title && (
                <div className="flex justify-between">

                  <span>
                    🎬 {item.title}
                  </span>

                  {item.score && (
                    <span className="text-zinc-400">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}