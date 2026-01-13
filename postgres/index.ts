const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to PostgreSQL");

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);

  await client.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    ["Kartik", "k@gmail.com"]
  );

  const res = await client.query("SELECT * FROM users");
  console.log(res.rows);

  await client.end();
}

main().catch(console.error);
