module.exports = {
  type: "postgres",
  host: "order-postgres-srv",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: ["src/models/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
};
