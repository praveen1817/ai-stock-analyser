import pkg from "pg";
const { Pool } = pkg;

let pool;

export const connectToDatabase = async () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ PostgreSQL connected");
  }

  return pool;
};
