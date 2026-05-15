import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
console.log("api key", API_KEY);

export const getMovieImage = async (title) => {

  try {

    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: API_KEY,
          query: title,
        },

        timeout: 5000,

        headers: {
          "User-Agent": "CineQueryAI/1.0",
        },

      }
    );

    const movie = response.data.results[0];

    if (!movie) {

      return {
        poster:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",

        rating: "N/A",

        year: "Unknown",

        overview:
          "Movie discovered from CineQuery graph database.",
      };
    }
    return {
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,

      backdrop: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null,

      rating: movie.vote_average,

      year: movie.release_date?.split("-")[0],

      overview: movie.overview,
    };

  }catch (err) {

  console.error(
    "TMDB Movie Error:",
    err.message
  );

  return {

    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",

    rating: "N/A",

    year: "Unknown",

    overview:
      "Movie discovered from CineQuery graph database.",
  };
}
};

export const getPersonImage = async (name) => {

  try {

    const response = await axios.get(
      "https://api.themoviedb.org/3/search/person",
      {
        params: {
          api_key: API_KEY,
          query: name,
        },

        timeout: 5000,

        headers: {
          "User-Agent": "CineQueryAI/1.0",
        },
      }
    );

    const person = response.data.results[0];

    if (!person) return null;

    return {
      image: person.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : "https://via.placeholder.com/500x700?text=No+Image",

      knownFor: person.known_for_department,
    };

  } catch (err) {

    console.error("TMDB Person Error:", err.message);

    return null;
  }
};