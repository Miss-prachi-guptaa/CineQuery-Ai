import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

    const results =
      await runQuery(query);

    res.json({
      query,
      results
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