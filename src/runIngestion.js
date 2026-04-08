// src/runIngestion.js
import dotenv from "dotenv";
dotenv.config({
  path: new URL("../.env", import.meta.url).pathname,
});

console.log("ENV CHECK:", process.env.GROQ_API_KEY);

import { runIngestionPipeline } from "./modules/ingestion/ingestionPipeline.js";

runIngestionPipeline();