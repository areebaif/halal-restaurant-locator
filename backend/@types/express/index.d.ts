import { Pool, QueryResult } from "pg";

declare global {
  namespace Express {
    interface Request {
      _db?: Pool;
    }
  }
}
