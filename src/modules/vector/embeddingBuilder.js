export const buildEmbeddingText = (movie) => {
  return `
  Movie: ${movie.title}
  Director: ${movie.director}
  Actors: ${movie.actors.join(", ")}
  Genre: ${Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
  Themes: ${movie.themes.join(", ")}
  `;
};