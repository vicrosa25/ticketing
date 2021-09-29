import { createConnection } from "typeorm";
import { app } from "./app";
import { natsWrapper } from "./nat-wrapper";

// Start the Server and the Mongo Database
const start = async () => {
  console.log("starting...");

  // Check environment variables
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.POSTGRE_HOST) {
    throw new Error("POSTGRE_HOST must be define");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be define");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be define");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be define");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // Activate Listener

    await createConnection();
    console.log("Connected to Postgres");
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log("Listining on port 3000!!!!!");
  });
};

start();
