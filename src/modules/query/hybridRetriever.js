import axios from "axios";
import dotenv from "dotenv";

import driver from "../graph/neo4j.js";

import { getEmbedding }
  from "../vector/embeddingService.js";

import { movieCollection }
  from "../vector/vectorStore.js";

dotenv.config();

const GROQ_API_KEY =
  process.env.GROQ_API_KEY;

export const runHybridQuery =
  async (query) => {

    try {

      // 🧠 STEP 1: Extract filters
      const prompt = `
Extract structured information.

Return ONLY valid JSON.

Example:

Query:
oscar-winning sci-fi movies

Output:
{
  "award": "Oscar",
  "semantic_query": "sci-fi movies"
}

Query:
${query}
`;

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0,
          response_format: {
            type: "json_object"
          }
        },
        {
          headers: {
            Authorization:
              `Bearer ${GROQ_API_KEY}`,
            "Content-Type":
              "application/json"
          }
        }
      );

      const parsed = JSON.parse(
        response.data.choices[0]
          .message.content
      );

      console.log(
        "🧠 Hybrid Parsed:",
        parsed
      );

      // ✅ STEP 2: Graph filtering
      const session = driver.session();

      const graphResult =
        await session.run(
          `
        MATCH (m:Movie)-[:WON]->(:AwardWin)
              -[:TYPE]->(a:AwardType)

        WHERE toLower(a.name)
          CONTAINS toLower($award)

        RETURN DISTINCT m.title AS title
        `,
          {
            award: parsed.award
          }
        );

      const candidateTitles =
        graphResult.records.map(
          r => r.get("title")
        );

      console.log(
        "🎬 Candidates:",
        candidateTitles.length
      );

      await session.close();

      // 🚨 No candidates
      if (candidateTitles.length === 0) {
        return [];
      }

      // ✅ STEP 3: Semantic embedding
      const embedding =
        await getEmbedding(
          parsed.semantic_query
        );

      // ✅ STEP 4: Vector reranking
      const results =
        await movieCollection.aggregate([
          {
            $vectorSearch: {
              index: "movie_index",
              path: "embedding",
              queryVector: embedding,
              numCandidates: 100,
              limit: 20,

              // ✅ Only search among graph candidates
              filter: {
                title: {
                  $in: candidateTitles
                }
              }
            }
          },

          // ✅ Return useful fields
          {
            $project: {
              _id: 0,
              title: 1,
              score: {
                $meta: "vectorSearchScore"
              }
            }
          }

        ]).toArray();

      return results;

    } catch (err) {

      console.error(
        "❌ Hybrid Retrieval Error:",
        err.message
      );

      throw err;
    }
  };