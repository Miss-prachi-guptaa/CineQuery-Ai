// src/app.js

import express from "express";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running 🚀" });
});

export default app;