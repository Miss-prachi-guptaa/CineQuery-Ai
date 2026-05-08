import axios from "axios";
import dotenv from "dotenv";

import driver from "../graph/neo4j.js";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const runGraphQuery = async (query) => {

  try {

    // 🧠 STEP 1: Extract intent/entities using LLM
    const prompt = `
You are a movie query parser.

Extract structured information from the query.

Return ONLY valid JSON.

Possible intents:

1. movies_by_director
→ user asks for movies by a director

2. actors_in_movie
→ user asks actors from ONE specific movie

3. movies_by_genre
→ user asks movies of a genre

4. actors_in_director_movies
→ user asks actors appearing in movies directed by someone


Examples:

Query:
movies directed by Christopher Nolan

Output:
{
  "intent": "movies_by_director",
  "director": "Christopher Nolan"
}

Query:
actors in Titanic

Output:
{
  "intent": "actors_in_movie",
  "movie": "Titanic"
}

Query:
psychological thriller movies

Output:
{
  "intent": "movies_by_genre",
  "genre": "Psychological Thriller"
}

Query:
actors in movies directed by James Cameron

Output:
{
  "intent": "actors_in_director_movies",
  "director": "James Cameron"
}

Carefully distinguish between:
- actors in ONE movie
- actors in movies by a director
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
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 🧠 STEP 2: Parse JSON
    const content =
      response.data.choices[0].message.content;

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```python/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log("🧠 Parsed Query:", parsed);

    // 🧠 STEP 3: Execute Neo4j query
    const session = driver.session();

    let result;

    // ✅ Movies by director
    if (parsed.intent === "movies_by_director") {

      result = await session.run(
        `
        MATCH (m:Movie)-[:DIRECTED_BY]->(d:Person)
        WHERE toLower(d.name) CONTAINS toLower($director)
        RETURN m.title AS movie
        `,
        {
          director: parsed.director
        }
      );
    }

    // ✅ Actors in movie
    else if (parsed.intent === "actors_in_movie") {

      result = await session.run(
        `
        MATCH (a:Person)-[:ACTED_IN]->(m:Movie)
        WHERE toLower(m.title) CONTAINS toLower($movie)
        RETURN a.name AS actor
        `,
        {
          movie: parsed.movie
        }
      );
    }

    // ✅ Movies by genre
    else if (parsed.intent === "movies_by_genre") {

      result = await session.run(
        `
        MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre)
        WHERE toLower(g.name) CONTAINS toLower($genre)
        RETURN m.title AS movie
        `,
        {
          genre: parsed.genre
        }
      );
    }
    // ✅ Actors in movies by director
    else if (
      parsed.intent === "actors_in_director_movies"
    ) {

      result = await session.run(
        `
    MATCH (d:Person)<-[:DIRECTED_BY]-(m:Movie)
          <-[:ACTED_IN]-(a:Person)

    WHERE toLower(d.name)
      CONTAINS toLower($director)

    RETURN DISTINCT a.name AS actor
    `,
        {
          director: parsed.director
        }
      );
    }

    else {
      return {
        error: "Unsupported graph query"
      };
    }

    // 🧠 STEP 4: Format response
    const records = result.records.map(r => r.toObject());

    await session.close();

    return records;

  } catch (err) {

    console.error("❌ Graph Query Error:", err.message);

    throw err;
  }
};