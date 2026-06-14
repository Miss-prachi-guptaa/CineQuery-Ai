import dotenv from "dotenv";
dotenv.config();

import { classifyQuery } from "../modules/query/queryClassifier.js";

const run = async () => {

  const queries = [
    "movies directed by Christopher Nolan",
    "movies like inception",
    "oscar-winning sci-fi movies"
  ];

  for (const q of queries) {

    const type = await classifyQuery(q);

    console.log(`\nQuery: ${q}`);
    console.log(`Type: ${type}`);
  }
};

run();