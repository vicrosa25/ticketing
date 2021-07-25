module.exports = {
  type: "postgres",
  host: process.env.POSTGRE_HOST,
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: ["src/models/*.ts"],
};
