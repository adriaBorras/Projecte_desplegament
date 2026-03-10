import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export const db = mysql.createPool(dbConfig);

function testConnection(retries = 20, delay = 3000) {
  db.getConnection((err, connection) => {
    if (err) {
      console.log(`MySQL not ready yet (${retries} retries left)...`, err.code);
      if (retries > 0) setTimeout(() => testConnection(retries - 1, delay), delay);
      else process.exit(1); // exit if DB never comes up
    } else {
      console.log("Connected to MySQL!");
      connection.release();
    }
  });
}

// Start retry loop
testConnection();