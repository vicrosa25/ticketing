module.exports = {
  type: "postgres",
  host: "tickets-postgres-srv",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: ["src/models/*.ts"],
};
