import fs from "fs";
import dotenv from "dotenv";
import { insertMovie } from "./modules/graph/graphInserter.js";

dotenv.config();



const runGraphInsert = async () => {
  try {
    // ✅ Read extracted JSON
    const movies = JSON.parse(
      fs.readFileSync("data/processed/movies.json")
    );

    console.log(`🚀 Total movies: ${movies.length}`);

    // ✅ Insert into Neo4j
    for (let i = 0; i < movies.length; i++) {
      console.log(`📥 Inserting ${i + 1}/${movies.length}`);

      await insertMovie(movies[i]);
    }

    console.log("🎉 Graph insertion complete!");

  } catch (err) {
    console.error("❌ Graph Insert Error:", err);
  }
};

// node src/runGraphInsert.js
runGraphInsert();