import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const q = req.query.cat
      ? "SELECT * FROM posts WHERE cat=?"
      : "SELECT * FROM posts";

    const [data] = await connection.query(q, [req.query.cat]);
    console.log(res.status(200).json(data));
    return res.status(200).json(data);
  } catch (err) {
    console.error("Error en getPosts:", err);
    return res
      .status(500)
      .json({ error: "Error interno del servidor", details: err.message });
  } finally {
    if (connection) connection.release();
  }
};

export const getPost = async (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  try {
    const [data] = await db.query(q, [req.params.id]);

    if (data.length === 0) return res.status(404).json("Post not found!");

    return res.status(200).json(data[0]);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    try {
      await db.query(q, [values]);
      return res.status(200).json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    try {
      const [result] = await db.query(q, [postId, userInfo.id]);

      if (result.affectedRows === 0) {
        return res.status(403).json("You can delete only your post!");
      }

      return res.json("Post has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

    try {
      const [result] = await db.query(q, [...values, postId, userInfo.id]);

      if (result.affectedRows === 0) {
        return res.status(403).json("You can update only your post!");
      }

      return res.json("Post has been updated.");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};
