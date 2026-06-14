import dotenv from "dotenv";
dotenv.config();

import { runVectorSearch }
  from "../modules/query/vectorRetriever.js";

const run = async () => {

  const queries = [
    "movies like inception",
    "emotional space thriller",
    "dark psychological movies"
  ];

  for (const q of queries) {

    console.log(`\n🎬 QUERY: ${q}`);

    const result = await runVectorSearch(q);

    console.log(result);
  }
};

run();