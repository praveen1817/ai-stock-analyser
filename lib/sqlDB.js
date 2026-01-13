import mysql from "mysql2/promise";

let connection;
let initialized = false;

export const connectToDatabase = async () => {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectTimeout: 30000
      });

      console.log(" DB connected");
    } catch (err) {
      console.error(" DB connection failed, will retry:", err.message);
      connection = null;
      throw err; 
    }
  }

  if (connection && !initialized) {
    try {
      await initDb(connection);
      initialized = true;
    } catch (err) {
      console.error(" DB init failed, will retry later:", err.message);
    }
  }

  return connection;
};

const initDb = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      number VARCHAR(15) NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log(" users table ready");
};
