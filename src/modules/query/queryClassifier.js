import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const classifyQuery = async (query) => {
  try {

    const prompt = `
You are a query classifier for a movie intelligence system.

Classify the user query into ONE of these categories only:

- graph
→ relational/factual queries
Examples:
"movies directed by Nolan"
"actors in Titanic"
"oscar winning movies"

- vector
→ semantic similarity queries
Examples:
"movies like inception"
"emotional sci-fi movies"
"mind bending thriller"

- hybrid
→ requires both relational + semantic retrieval
Examples:
"oscar-winning sci-fi movies"
"thriller movies directed by Nolan"

Return ONLY one word:
graph
vector
hybrid

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
        temperature: 0
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content.trim();

  } catch (err) {
    console.error("❌ Query Classification Error:", err.message);
    throw err;
  }
};