import { getEmbedding } from "../vector/embeddingService.js";
import { movieCollection } from "../vector/vectorStore.js";

export const runVectorSearch = async (query) => {

  try {

    // ✅ Generate query embedding
    const embedding = await getEmbedding(query);

    console.log("🧠 Query embedding generated");

    // ✅ MongoDB vector search
    const results = await movieCollection.aggregate([
      {
        $vectorSearch: {
          index: "movie_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 10
        }
      },
      {
        $project: {
          _id: 0,
          title: 1,
          director: 1,
          genre: 1,
          score: {
            $meta: "vectorSearchScore"
          }
        }
      }
    ]).toArray();

    return results;

  } catch (err) {

    console.error("❌ Vector Search Error:", err.message);

    throw err;
  }
};