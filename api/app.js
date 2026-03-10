import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../front/public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  },
});


const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
  if (!req.file) {
    return res.status(400).json("No se ha subido ningún archivo.");
  }
  const file = req.file;
  res.status(200).json(file.filename); 
});


app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Global error handler
// app.use((err, req, res, next) => {
//   console.error("Global error:", err);
//   res.status(500).json({ error: err.message || "Internal Server Error" });
// });

export default app;