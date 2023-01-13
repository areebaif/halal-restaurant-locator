import { Pool } from "pg";
import keys from "../config/keys";

interface PoolOptions {
  host: string | undefined;
  port: number | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
}

const poolOption = {
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: parseInt(`${keys.database_port}`),
};

export class DBPool {
  _pool: Pool;
  private options: PoolOptions;
  constructor(connectionOptions: PoolOptions) {
    this._pool = new Pool();
    this.options = connectionOptions;
  }
  // we are doing this to reconnect our pool to different database like for testing purposes
  async connect() {
    this._pool = new Pool(this.options);
    //force the pool to connect to database
    await this._pool.query("SELECT 1+1;");
    console.log("connected to db");
    return this._pool;
  }

  close() {
    return this._pool.end();
  }
}

export const dbPool = new DBPool(poolOption);
