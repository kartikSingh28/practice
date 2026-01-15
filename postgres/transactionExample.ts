const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to postgres");

  try {
    console.log("Starting transactions");
    await client.query("BEGIN"); //will dont store all the op made in temp stoRage ad can rollback if error arieses untill its commited

    const userRes = await client.query(
      "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING id",
      ["MAHESHdALLE", "M@gmail.com"]
    );

    const userId = userRes.rows[0].id;
    console.log("Inserted user with id:", userId);

    //entering the error so that it can rollback
    await client.query(
      "INSERT INTO orders (user_id,product,price) VALUES ($1,$2,$3)",
      [userId, "BrokenItem", -500]
    );

    await client.query("COMMIT"); // this line will never run
    console.log("Transaction Commited");

  } catch (err) {
    console.log("Error happened rolling back..");
    await client.query("ROLLBACK");
  }

  // Check if anything was saved
  const users = await client.query(
    "SELECT * FROM users WHERE email = 'M@gmail.com'"
  );
  console.log("User after rollback:", users.rows);

  const orders = await client.query(
    "SELECT * FROM orders WHERE product = 'BrokenItem'"
  );
  console.log("Order after rollback:", orders.rows);

  // ---------------- SUCCESSFUL TRANSACTION ----------------

  try {
    console.log("Starting good transaction...");
    await client.query("BEGIN");

    const userRes = await client.query(
      "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING id",
      ["GOODUSER", "good@gmail.com"]
    );

    const userId = userRes.rows[0].id;
    console.log("Inserted good user with id:", userId);

    await client.query(
      "INSERT INTO orders (user_id,product,price) VALUES ($1,$2,$3)",
      [userId, "Phone", 40000]
    );

    await client.query("COMMIT"); // this time it will run
    console.log("Good Transaction Commited");

  } catch (err) {
    console.log("Error in good transaction, rolling back..");
    await client.query("ROLLBACK");
  }

  const goodUsers = await client.query(
    "SELECT * FROM users WHERE email = 'good@gmail.com'"
  );
  console.log("Good user after commit:", goodUsers.rows);

  const goodOrders = await client.query(
    "SELECT * FROM orders WHERE product = 'Phone'"
  );
  console.log("Good order after commit:", goodOrders.rows);

  await client.end();
  console.log("Connection closed");
}

main().catch(console.error);
