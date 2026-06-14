import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// movies.json
//    ↓
// Build Semantic Text
//    ↓
// Generate Embedding
//    ↓
// Store Embedding in MongoDB
//    ↓
// Vector Search Ready

import { buildEmbeddingText } from "./modules/vector/embeddingBuilder.js";
import { getEmbedding } from "./modules/vector/embeddingService.js";
import { storeMovieEmbedding } from "./modules/vector/vectorStore.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runEmbedding = async () => {
  try {
    // ✅ Read extracted movies
    const movies = JSON.parse(
      fs.readFileSync("data/processed/movies.json")
    );

    console.log(`🚀 Total movies: ${movies.length}`);

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];

      console.log(`🎬 Processing ${i + 1}/${movies.length}: ${movie.title}`);

      // ✅ Build semantic text
      const text = buildEmbeddingText(movie);

      // ✅ Generate embedding
      const embedding = await getEmbedding(text);

      // ✅ Store in MongoDB
      await storeMovieEmbedding(movie, embedding);

      console.log(`✅ Stored embedding for ${movie.title}`);

      // ⏱ Delay to avoid rate limit
      await delay(2000);
    }

    console.log("🎉 Embedding pipeline completed!");

  } catch (err) {
    console.error("❌ Embedding Error:", err);
  }
};

//   node src/runEmbedding.js
runEmbedding();