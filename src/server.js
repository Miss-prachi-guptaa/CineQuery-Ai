import dotenv from "dotenv";
import app from "./app.js";
import { connectMongo, connectNeo4j } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DBs
await connectMongo();
connectNeo4j();


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});