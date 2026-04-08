// src/modules/ingestion/chunker.js

export const splitMovies = (text) => {
  // Split using separator
  const movies = text.split('-------------------------------------');

  // Clean empty chunks
  return movies
    .map(movie => movie.trim())
    .filter(movie => movie.length > 0);
};