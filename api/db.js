import mysql from "mysql"
import dotenv from "dotenv"

// export const db = mysql.createConnection({
//   host:"localhost",
//   user:"root",
//   password:"",
//   database:"blog"
// })

dotenv.config(); // loads .env into process.env


export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER, 
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.MYSQL_DATABASE 
});

// db.getConnection((err, connection) => {
//   if (err) {
//     console.error("DB pool connection error:", err);
//     return;
//   }
//   console.log("Connected to MySQL via pool!");
//   connection.release(); // release back to pool
// });