export {};

const app = require("./app");
const { createTables } = require("./tables");

async function start() {
  await createTables();

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

start();
