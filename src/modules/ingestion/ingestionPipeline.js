// src/modules/ingestion/ingestionPipeline.js

import fs from "fs";
import { splitMovies } from "./chunker.js";
import { parsePDF } from "./pdfParser.js";
import {
  createBatches,
  processBatchesInParallel,
  processWithRetry,
} from "./batchProcessor.js";
import { extractMoviesFromBatch } from "./llmExtractor.js";

import dotenv from "dotenv";
dotenv.config({});



// export const runIngestionPipeline = async () => {





//   try {
//     console.log("🚀 Starting ingestion...");




//     const text = await parsePDF("data/raw/movies.pdf");

//     console.log("---- SAMPLE TEXT ----");
//     console.log(text.slice(0, 1000));

//     // 🔹 Step 2: Chunk into movies
//     const movies = splitMovies(text);
//     console.log(`✅ Total movies: ${movies.length}`);

//     // 🔍 Show first 2 chunks (VERY IMPORTANT)
//     console.log("\n🎬 FIRST MOVIE CHUNK:");
//     console.log(movies[0]);

//     console.log("\n🎬 SECOND MOVIE CHUNK:");
//     console.log(movies[1]);

//     // 🔹 Step 3: Create batches
//     const batches = createBatches(movies, 50);
//     console.log(`✅ Total batches: ${batches.length}`);

//     // 🔹 Step 4: Process batches (parallel + retry)
//     const results = await processBatchesInParallel(
//       batches,
//       extractMoviesFromBatch,
//       5
//     );

//     // 🔹 Step 5: Flatten results
//     const finalData = results.flat().filter(Boolean);

//     console.log(`✅ Extracted movies: ${finalData.length}`);

//     // 🔹 Step 6: Save output
//     fs.writeFileSync(
//       "data/processed/movies.json",
//       JSON.stringify(finalData, null, 2)
//     );

//     console.log("🎉 Ingestion completed!");
//   } catch (err) {
//     console.error("Pipeline Error:", err);
//   }
// };

export const runIngestionPipeline = async () => {
  try {
    console.log("🚀 Starting ingestion...");

    const text = await parsePDF("data/raw/movies.pdf");

    console.log("---- SAMPLE TEXT ----");
    console.log(text.slice(0, 1000));

    // 🔹 Step 2: Chunk into movies
    const movies = splitMovies(text).slice(0, 50);
    console.log(`✅ Total movies: ${movies.length}`);
    // 🔹 Step 3: Create SMALL batches (safe start)
    const batchSize = 6;
    const batches = [];

    for (let i = 0; i < movies.length; i += batchSize) {
      batches.push(movies.slice(i, i + batchSize));
    }

    console.log(`📦 Total batches: ${batches.length}`);

    // 🔹 Step 4: Process batches (NO parallel yet)
    let finalData = [];

    for (let i = 0; i < batches.length; i++) {
      console.log(`\n🚀 Processing batch ${i + 1}/${batches.length}`);

      const result = await processWithRetry(() =>
        extractMoviesFromBatch(batches[i])
      );

      finalData.push(...result);
      await new Promise(resolve => setTimeout(resolve, 9000)); // 9 seconds between calls
    }

    console.log(`\n🎉 Total extracted movies: ${finalData.length}`);

  } catch (err) {
    console.error("Pipeline Error:", err);
  }
};