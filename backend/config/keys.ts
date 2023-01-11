import { devKeys } from "./dev";
import { prodKeys } from "./prod";

interface Database {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  databse_port?: number;
}

const keys: {
  user?: string;
  host?: string;
  database?: string;
  password?: string;
  database_port?: string;
  port?: string;
  node_env?: string;
} = process.env.NODE_ENV === "development" ? devKeys : prodKeys;

export default keys;
