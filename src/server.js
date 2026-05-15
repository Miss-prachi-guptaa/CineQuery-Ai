import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  getMovieImage,
  getPersonImage
} from "./utils/tmdb.js";

import { runQuery }
  from "./modules/query/queryOrchestrator.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT =
  process.env.PORT || 5000;


// ✅ Health route
app.get("/", (req, res) => {

  res.json({
    message:
      "🚀 CineQuery AI Backend Running"
  });
});

const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
const imageCache = {};

// ✅ Main query route
app.post("/query", async (req, res) => {

  try {

    const { query } = req.body;

    if (!query) {

      return res.status(400).json({
        error: "Query is required"
      });
    }

    console.log(
      `🎬 Incoming Query: ${query}`
    );

    // Neo4j / AI Results
    const results =
      await runQuery(query);

    // TMDB ENRICHMENT
    const enrichedResults = [];

    for (const item of results.slice(0, 8)) {

      try {

        // Actor
        if (item.actor) {

          // CACHE HIT
          if (imageCache[item.actor]) {

            enrichedResults.push({
              ...item,
              ...imageCache[item.actor],
              type: "actor",
            });

            continue;
          }

          // TMDB FETCH
          const tmdbData =
            await getPersonImage(item.actor);

          // SAVE CACHE
          imageCache[item.actor] = tmdbData;

          enrichedResults.push({
            ...item,
            ...tmdbData,
            type: "actor",
          });

          continue;
        }
        // Movie
        if (item.movie) {

            console.log("MOVIE FOUND:", item.movie);

          const tmdbData =
            await getMovieImage(item.movie);

              console.log("TMDB DATA:", tmdbData);

          enrichedResults.push({
            ...item,
            ...tmdbData,
            type: "movie",
          });

          continue;
        }

        // Vector Movie
        if (item.title) {

          const tmdbData =
            await getMovieImage(item.title);

          enrichedResults.push({
            ...item,
            ...tmdbData,
            type: "vectorMovie",
          });

          continue;
        }

        enrichedResults.push(item);

      } catch (err) {

        console.log(
          "TMDB Single Item Error:",
          err.message
        );

        enrichedResults.push(item);
      }
    }

    res.json({
      query,
      results: enrichedResults
    });

  } catch (err) {

    console.error(
      "❌ API Error:",
      err.message
    );

    res.status(500).json({
      error:
        "Internal server error"
    });
  }
});


// ✅ Start server
app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );
});