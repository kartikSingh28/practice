const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to postgres");


  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      product TEXT NOT NULL,
      price INT CHECK (price > 0),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

try {
  await client.query(`
    ALTER TABLE orders
    ADD CONSTRAINT unique_user_product UNIQUE (user_id, product);
  `);
} catch (err) {
  // Ignore if already exists
}

  const users = await client.query("SELECT * FROM users;");
  console.log("Users:", users.rows);

await client.query(
  `INSERT INTO orders (user_id, product, price)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, product) DO NOTHING`,
  [1, "Tablet", 80000]
);

await client.query(
  `INSERT INTO orders (user_id, product, price)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, product) DO NOTHING`,
  [4, "Tablet", 60000]
);

await client.query(
  `INSERT INTO orders (user_id, product, price)
   VALUES ($1, $2, $3)
   ON CONFLICT (user_id, product) DO NOTHING`,
  [5, "IPHONE", 100000]
);


  const orders = await client.query("SELECT * FROM orders;");
  console.log("Orders:", orders.rows);

const joinRes = await client.query(`
  SELECT users.name, orders.product, orders.price
  FROM users
  JOIN orders ON users.id = orders.user_id;
`);
console.log("Join result:", joinRes.rows);


const aggRes = await client.query(`
  SELECT users.name, SUM(orders.price) AS total_spent
  FROM users
  JOIN orders ON users.id = orders.user_id
  GROUP BY users.name;
`);
console.log("Total spent:", aggRes.rows);


  await client.end();
}

main().catch(console.error);
