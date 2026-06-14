import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME,
    process.env.NEO4J_PASSWORD
  )
);

export default driver;

async function testConnection() {
  try {
    await driver.verifyConnectivity();

    console.log("✅ Neo4j Connected");
    console.log(await driver.getServerInfo());

  } catch (err) {
    console.error("❌ Neo4j Error FULL:", err);
  }
}

testConnection();