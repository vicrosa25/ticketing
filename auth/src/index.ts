import { createConnection } from "typeorm";

import { app } from "./app";

// Start the Server and the Mongo Database
const start = async () => {
  // Check environment variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    createConnection();
    console.log("Connected to Postgres");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Listining on port 3000!!!!!");
  });
};

start();
