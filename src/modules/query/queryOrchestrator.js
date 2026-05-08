import axios from "axios";
import dotenv from "dotenv";
import { runHybridQuery }
  from "./hybridRetriever.js";

import { runGraphQuery }
  from "./graphRetriever.js";

import { runVectorSearch }
  from "./vectorRetriever.js";

dotenv.config();

const GROQ_API_KEY =
  process.env.GROQ_API_KEY;

export const runQuery = async (query) => {

  try {

    // 🧠 STEP 1: Classify query
    const prompt = `
Classify the movie query into ONE category:

- graph
→ relational queries
→ directors, actors, awards, genres

- vector
→ similarity/semantic queries
→ "movies like", emotions, themes, moods

- hybrid
→ needs BOTH graph + semantic reasoning

Return ONLY valid JSON.

Examples:

Query:
movies directed by Nolan

Output:
{
  "type": "graph"
}

Query:
movies like inception

Output:
{
  "type": "vector"
}

Query:
oscar-winning sci-fi movies

Output:
{
  "type": "hybrid"
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

    const content =
      response.data.choices[0]
        .message.content;

    const parsed = JSON.parse(content);

    console.log(
      "🧠 Query Type:",
      parsed.type
    );

    // ✅ GRAPH
    if (parsed.type === "graph") {

      return await runGraphQuery(query);
    }

    // ✅ VECTOR
    if (parsed.type === "vector") {

      return await runVectorSearch(query);
    }

    // ✅ HYBRID
    if (parsed.type === "hybrid") {

      return await runHybridQuery(query);
    }

    return {
      error: "Unknown query type"
    };

  } catch (err) {

    console.error(
      "❌ Orchestrator Error:",
      err.message
    );

    throw err;
  }
};