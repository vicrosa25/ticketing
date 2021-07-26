module.exports = {
  type: "postgres",
  host: process.env.POSTGRE_HOST,
  port: 5432,
  username: "test",
  password: "test",
  database: "auth",
  synchronize: true,
  logging: false,
  entities: ["src/models/*.ts"],
};
