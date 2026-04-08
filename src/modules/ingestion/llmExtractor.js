// src/modules/ingestion/llmExtractor.js

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({});

const GROQ_API_KEY = process.env.GROQ_API_KEY;
console.log("API KEY LOADED:", process.env.GROQ_API_KEY);

// 🧹 Clean LLM output
const cleanJSON = (text) => {
  try {
    // remove markdown
    text = text.replace(/```json/g, "").replace(/```/g, "");

    // find JSON array first
    let start = text.indexOf("[");
    let end = text.lastIndexOf("]");

    // if array not found, fallback to object
    if (start === -1 || end === -1) {
      start = text.indexOf("{");
      end = text.lastIndexOf("}");
    }

    if (start !== -1 && end !== -1) {
      return text.slice(start, end + 1);
    }

    throw new Error("No JSON found");
  } catch (err) {
    console.error("JSON extraction failed:", text);
    throw err;
  }
};

export const extractMoviesFromBatch = async (batch) => {
  const prompt = `
Extract structured movie data from the following text.

Return ONLY valid JSON (no explanation).
If awards is "None", return empty array [] instead.

Schema:
[
  {
    "title": "",
    "director": "",
    "actors": [],
    "genre": "",
    "themes": [],
    "awards": []
  }
]

Text:
${batch.join("\n")}
`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0,
        }),
      }
    );

    const data = await response.json();

    // 🔍 Debug full response
    if (!response.ok) {
      console.error("❌ API Error:", data);
      throw new Error("Groq API failed");
    }

    // 🛑 Validate structure
    if (!data.choices || !data.choices[0]) {
      console.error("❌ Invalid LLM response:", data);
      throw new Error("Invalid LLM response structure");
    }

    let text = data.choices[0].message.content;

    // 🧹 clean before parsing
    text = cleanJSON(text);
    console.log(text)
    const parsed = JSON.parse(text);

    // 🔥 normalize to array
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error("LLM Extraction Error:", err);
    throw err;
  }
};