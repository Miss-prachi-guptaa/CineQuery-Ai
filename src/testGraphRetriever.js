import dotenv from "dotenv";
dotenv.config();

import { runGraphQuery } from "./modules/query/graphRetriever.js";

const run = async () => {

  const queries = [
    "actors in movies directed by James Cameron"
  ];

  for (const q of queries) {

    console.log(`\n🎬 QUERY: ${q}`);

    const result = await runGraphQuery(q);

    console.log(result);
  }
};

run();