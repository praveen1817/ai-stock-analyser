import { connectToDatabase } from "./sqlDB.js";

export const initDb = async () => {
  try {
    const db = await connectToDatabase();

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
  } catch (error) {
    console.error(" DB init failed:", error);
    process.exit(1); 
  }
};
