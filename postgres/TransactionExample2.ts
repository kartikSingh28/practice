const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to postgres");

  await client.query(`
    CREATE TABLE IF NOT EXISTS Students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);

  console.log("Created Table Students");


  await client.query(`
    INSERT INTO Students (name, email) VALUES
      ('kARTIK','K@gmail.com'),
      ('bengali','R@gmail.com'),
      ('dij','DiJ@gmail.com'),
      ('Annie','A@gmail.com')
    ON CONFLICT (email) DO NOTHING;
  `);

  const s = await client.query("SELECT * FROM Students");
  console.log("Students:", s.rows);

  // table 2
  await client.query(`
    CREATE TABLE IF NOT EXISTS id_cards (
      id SERIAL PRIMARY KEY,
      student_id INT REFERENCES Students(id) ON DELETE CASCADE,
      card_number TEXT UNIQUE NOT NULL
    );
  `);

  try {
    console.log("Transaction started");
    await client.query("BEGIN");

    const studentId = 2; 
    const cardNumber = "CARD-1002";

    // Check if student already has card
    const check = await client.query(
      "SELECT * FROM id_cards WHERE student_id = $1",
      [studentId]
    );

    if (check.rows.length > 0) {
      throw new Error("Student already has an ID card");
    }

    // Insert id card
    await client.query(
      "INSERT INTO id_cards (student_id, card_number) VALUES ($1, $2)",
      [studentId, cardNumber]
    );

    await client.query("COMMIT");
    console.log("ID card issued successfully");

  } catch (err) {
    console.log("Error:");
    await client.query("ROLLBACK");
    console.log("Transaction rolled back");
  }

  const cards = await client.query("SELECT * FROM id_cards");
  console.log("All ID Cards:", cards.rows);

  await client.end();
  console.log("Connection closed");
}

main().catch(console.error);
