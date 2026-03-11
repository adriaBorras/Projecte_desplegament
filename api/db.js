import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export const db = mysql.createPool(dbConfig);

export const connectDB = async (retries = 20) => {
  while (retries > 0) {
    try {
      const connection = await db.getConnection();
      console.log("✅ Conectado a MySQL con éxito!");
      connection.release();
      return;
    } catch (err) {
      retries--;
      console.error(
        `❌ Fallo de conexión (${err.code}). Reintentos restantes: ${retries}`,
      );
      if (retries === 0) process.exit(1);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

connectDB();
