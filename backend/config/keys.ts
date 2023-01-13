interface Database {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  database_port?: number;
}

const keys: {
  pgUser?: string;
  pgHost?: string;
  pgDatabase?: string;
  pgPassword?: string;
  database_port?: number;
  port?: string;
  node_env?: string;
} = {
  pgUser: process.env.POSTGRES_USER,
  pgHost: process.env.PG_HOST,
  pgDatabase: process.env.POSTGRES_DB,
  pgPassword:
    process.platform === "darwin"
      ? undefined
      : process.env.POSTGRES_PASSWORD?.toString(),
  database_port: parseInt(`${process.env.POSTGRES_PORT}`),
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
};

export default keys;
