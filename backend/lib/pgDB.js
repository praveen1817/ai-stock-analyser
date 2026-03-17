import pkg from "pg";
const { Pool } = pkg;

let pool;

export const connectToDatabase = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      family: 4
    });

    console.log("✅ PostgreSQL connected");
  }

  return pool;
};