import fs from "fs";

// ✅ Read dataset
const movies = JSON.parse(
  fs.readFileSync("data/processed/movies.json")
);

const updatedMovies = movies.map((movie) => {

  const normalizedAwards = (movie.awards || []).map((award) => {

    // ✅ Already object format
    if (typeof award === "object" && award !== null) {
      return {
        name: award.name || null,
        category: award.category || null
      };
    }

    // ✅ String format
    if (typeof award === "string") {

      // Example:
      // Oscar (Best Actress)

      const match = award.match(/^(.+?)\s*\((.+)\)$/);

      if (match) {
        return {
          name: match[1].trim(),
          category: match[2].trim()
        };
      }

      // Example:
      // "Oscar"

      return {
        name: award.trim(),
        category: null
      };
    }

    // fallback safety
    return {
      name: null,
      category: null
    };
  });

  return {
    ...movie,
    awards: normalizedAwards
  };
});

// ✅ Save cleaned dataset
fs.writeFileSync(
  "data/processed/movies.json",
  JSON.stringify(updatedMovies, null, 2)
);

console.log("🎉 Awards migration completed!");