import dotenv from "dotenv";
dotenv.config();

import { runQuery }
  from "./modules/query/queryOrchestrator.js";

const run = async () => {

  const queries = [

    "movies directed by James Cameron",

    "actors in movies directed by James Cameron",

    "movies like inception",

    "dark psychological movies",

    "oscar-winning sci-fi movies"
  ];

  for (const q of queries) {

    console.log("\n================================");
    console.log(`🎬 QUERY: ${q}`);

    const result = await runQuery(q);

    console.log(result);
  }
};

run();