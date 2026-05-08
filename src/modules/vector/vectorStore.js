import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({});


const client = new MongoClient(process.env.MONGO_URI);

await client.connect();

const db = client.db("Movie_recommendation");

export const movieCollection =
  db.collection("movies");

export const storeMovieEmbedding = async (movie, embedding) => {
  try {
    async (movie, embedding) => {

      await collection.insertOne({
        title: movie.title,
        embedding: embedding,
        metadata: movie
      })
    };

  } finally {
    await client.close();
  }
};