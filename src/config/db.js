// src/config/db.js

import mongoose from "mongoose";
import neo4j from "neo4j-driver";

// MongoDB Connection
export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
};

// Neo4j Connection
let driver;

export const connectNeo4j = () => {
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(
        process.env.NEO4J_USER,
        process.env.NEO4J_PASSWORD
      )
    );

    console.log("✅ Neo4j Connected");
  } catch (err) {
    console.error("❌ Neo4j Error:", err);
  }
};

export const getNeo4jSession = () => {
  return driver.session();
};