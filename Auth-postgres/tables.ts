export {};   // 👈 add this

const { client, connectDB } = require("./db");

async function createTables() {
  await connectDB();

  await client.query(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Users table ready");
}

module.exports = { createTables };
