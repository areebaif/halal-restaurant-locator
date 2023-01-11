export const devKeys = {
  user: process.env.POSTGRES_USER,
  host: process.env.PG_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD?.toString(),
  database_port: parseInt(`${process.env.POSTGRES_PORT}`),
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
};
